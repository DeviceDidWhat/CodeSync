import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/navbar.jsx";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";

import { useProblem } from "../hooks/useProblems";
import { generateCppJudge } from "../util/judge.js";
import { generateCppJudgeStdin, generateStdinInput } from "../util/judgeStdin.js";
import { executeCode } from "../util/piston.js";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id: slug } = useParams();
  const navigate = useNavigate();

  /* -----------------------------
     FETCH REAL PROBLEM FROM DB
  ----------------------------- */
  const { data: currentProblem, isLoading } = useProblem(slug);

  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  /* -----------------------------
     Load starter code from DB
  ----------------------------- */
  useEffect(() => {
    if (!currentProblem) return;

    setCode(currentProblem.starterCode?.cpp || "");
    setOutput(null);
  }, [currentProblem]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setCode(currentProblem.starterCode.cpp);
    setOutput(null);
  };

  const handleProblemChange = (newSlug) => {
    navigate(`/problem/${newSlug}`);
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  /* -----------------------------
     RUN CODE WITH DB TEST CASES
  ----------------------------- */
  const handleRunCode = async () => {
    if (!currentProblem) return;

    setIsRunning(true);
    setOutput(null);

    try {
      // Check if test cases are too large (use stdin method if total size > 10KB)
      const totalTestCaseSize = JSON.stringify(currentProblem.testCases).length;
      const useStdinMethod = totalTestCaseSize > 10 * 1024; // 10KB threshold

      let finalCode;
      let stdin = '';

      if (useStdinMethod) {
        // Use stdin-based approach for large test cases
        finalCode = generateCppJudgeStdin(currentProblem, code);
        stdin = generateStdinInput(currentProblem);
      } else {
        // Use traditional embedded approach for small test cases
        finalCode = generateCppJudge(currentProblem, code);
      }

      const result = await executeCode(selectedLanguage, finalCode, stdin);

      setOutput(result);
      setIsRunning(false);

      if (!result.success) {
        toast.error("Code execution failed");
        return;
      }

      const actualResults = result.output
        .trim()
        .split("\n")
        .map((l) => l.trim());

      const expectedResults = currentProblem.testCases.map((tc) =>
        JSON.stringify(tc.output)
      );

      const passed = actualResults.every(
        (res, i) => res === expectedResults[i]
      );

      if (passed) {
        triggerConfetti();
        toast.success("All tests passed!");
      } else {
        toast.error("Tests failed. Check your output.");
      }
    } catch (err) {
      setIsRunning(false);
      toast.error("Execution error");
      console.error(err);
    }
  };

  /* -----------------------------
     LOADING / ERROR STATES
  ----------------------------- */
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading problem...</p>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Problem not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT: PROBLEM DESCRIPTION */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={slug}
              onProblemChange={handleProblemChange}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize" />

          {/* RIGHT: EDITOR + OUTPUT */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize" />

              <Panel defaultSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;