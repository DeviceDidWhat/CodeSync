import { Link } from "react-router";
import { HomeIcon, SearchIcon, ArrowLeftIcon, CodeIcon, BugIcon } from "lucide-react";
import { useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* Animated 404 */}
          <div className="relative">
            <div className="text-[200px] font-black text-primary/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-base-content">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Looks like this code path doesn't exist. Even our best debugging skills couldn't find this page!
            </p>
          </div>

          {/* Code Block Animation */}
          <div className="mockup-code bg-base-300 max-w-2xl mx-auto text-left shadow-2xl">
            <pre data-prefix="$" className="text-warning">
              <code>npm run find-page</code>
            </pre>
            <pre data-prefix=">" className="text-error">
              <code>Error: ENOENT - Page not found</code>
            </pre>
            <pre data-prefix=">" className="text-base-content/60">
              <code>at Route.resolve (router.js:404:10)</code>
            </pre>
            <pre data-prefix=">" className="text-success">
              <code>Suggestion: Try navigating to a valid route</code>
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-primary gap-2 min-w-[200px]"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Go Back
            </button>

            <Link to="/dashboard" className="btn btn-primary gap-2 min-w-[200px]">
              <HomeIcon className="w-5 h-5" />
              Dashboard
            </Link>

            <Link to="/problems" className="btn btn-outline btn-secondary gap-2 min-w-[200px]">
              <CodeIcon className="w-5 h-5" />
              Browse Problems
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
