function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : (
          <div>
            {/* Execution stats */}
            {(output.executionTime !== undefined || output.compilationTime !== undefined) && (
              <div className="mb-3 text-xs text-base-content/60 space-y-1">
                {output.compilationTime !== undefined && (
                  <div>⏱️ Compilation: {output.compilationTime}ms</div>
                )}
                {output.executionTime !== undefined && (
                  <div>⚡ Execution: {output.executionTime}ms</div>
                )}
                {output.timeLimitExceeded && (
                  <div className="text-warning font-semibold">⚠️ Time Limit Exceeded</div>
                )}
              </div>
            )}

            {/* Output content */}
            {output.success ? (
              <pre className="text-sm font-mono text-success whitespace-pre-wrap">{output.output}</pre>
            ) : (
              <div>
                {output.output && (
                  <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                    {output.output}
                  </pre>
                )}
                <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;