import { useState } from "react";
import { ArrowRight, Check, Code2, Sparkles, Users, Video, Zap ,ArrowRightIcon} from "lucide-react";
import {SignInButton} from "@clerk/clerk-react";

function HomePage() {
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([
    { type: "text", content: "$ Welcome to CodeSync Terminal" },
    { type: "text", content: "$ Live video & audio calling (WebRTC based)" },
    { type: "text", content: "$ Multi-language coding support" },
    { type: "text", content: "$ Type 'help' for available commands" },
  ]);

  const handleTerminalCommand = (e) => {
    if (e.key === "Enter" && terminalInput.trim()) {
      const cmd = terminalInput.trim().toLowerCase();
      const newOutput = [...terminalOutput, { type: "input", content: `$ ${terminalInput}` }];

      if (cmd === "help") {
        newOutput.push({ type: "text", content: "Available commands: help, clear, connect, code, about" });
      } else if (cmd === "clear") {
        setTerminalOutput([]);
        setTerminalInput("");
        return;
      } else if (cmd === "connect") {
        newOutput.push({ type: "text", content: "✓ Connected to peer successfully" });
      } else if (cmd === "code") {
        newOutput.push({ type: "text", content: "const greeting = 'Welcome to CodeSync!' 🚀" });
      } else if (cmd === "about") {
        newOutput.push({ type: "text", content: "CodeSync v1.0 - Real-time Collaborative Coding Platform" });
      } else {
        newOutput.push({ type: "text", content: `Command not found: ${cmd}` });
      }

      setTerminalOutput(newOutput);
      setTerminalInput("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 min-h-screen text-white overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative bg-slate-950/40 backdrop-blur-xl border-b border-emerald-500/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-200 group cursor-pointer">
            <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-400/70">
              <Sparkles className="size-7 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent font-mono tracking-wider">
                CodeSync
              </span>
              <span className="text-xs text-emerald-400/70 font-medium -mt-1">Code Together</span>
            </div>
          </div>

          {/* AUTH BTN */}
            <SignInButton mode="modal">
                <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </SignInButton>
            </div>
        </nav>

      {/* HERO SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 pt-5 pb-5 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
              <Zap className="size-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">Real-time Collaboration</span>
            </div>

            <h1 className="text-6xl lg:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-white">Innovate Together</span>
            </h1>

            <p className="text-lg text-emerald-100/70 leading-relaxed max-w-xl">
              The ultimate platform for collaborative coding interviews and pair programming. Connect face-to-face, code in real-time, and ace your technical interviews with our powerful terminal-inspired interface.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              {["Live Video Chat", "Code Editor", "Multi-Language"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-emerald-500/30 rounded-lg backdrop-blur-sm hover:border-emerald-400/50 transition-colors">
                  <Check className="size-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-200">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
                <SignInButton mode="modal">
                    <button className="btn btn-primary btn-lg">
                    Start Coding Now
                    <ArrowRightIcon className="size-5" />
                    </button>
                </SignInButton>

              <button className="px-10 py-4 ml-3 bg-slate-800 border border-emerald-500/30 rounded-lg text-emerald-300 font-semibold hover:border-emerald-400/60 hover:bg-slate-700 transition-all duration-200 flex items-center gap-2">
                <Video className="size-5" />
                Watch Demo
              </button>
            </div>


            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: "10K+", label: "Active Users" },
                { value: "50K+", label: "Sessions" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-slate-800/30 border border-emerald-500/20 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="text-sm text-emerald-300/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT MAC TERMINAL */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl">
              {/* MAC TERMINAL HEADER */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-emerald-500/20 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-emerald-400/70 font-mono mr-18">codesync-terminal</p>
                </div>
              </div>

              {/* TERMINAL CONTENT */}
              <div className="p-6 font-mono text-sm h-96 overflow-y-auto bg-slate-950/50">
                <div className="space-y-2">
                  {terminalOutput.map((line, idx) => (
                    <div key={idx} className={line.type === "input" ? "text-emerald-400" : "text-emerald-300/80"}>
                      {line.content}
                    </div>
                  ))}
                </div>

                {/* INPUT LINE */}
                <div className="flex items-center gap-2 mt-4 text-emerald-400">
                  <span>$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={handleTerminalCommand}
                    placeholder="try 'help' command..."
                    className="bg-transparent outline-none flex-1 caret-emerald-400 placeholder-emerald-700/50"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            Everything You Need to <span className="text-emerald-400">Succeed</span>
          </h2>
          <p className="text-lg text-emerald-200/60 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Video, title: "HD Video Call", desc: "Crystal clear video and audio for seamless communication during interviews" },
            { icon: Code2, title: "Live Code Editor", desc: "Collaborate in real-time with syntax highlighting and multiple language support" },
            { icon: Users, title: "Easy Collaboration", desc: "Share your screen, discuss solutions, and learn from each other in real-time" },
          ].map((feature, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative p-8 bg-slate-800/40 border border-emerald-500/20 rounded-xl backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                <div className="size-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
                  <feature.icon className="size-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-emerald-200/60">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;