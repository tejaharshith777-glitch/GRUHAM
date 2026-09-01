import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[GRUHAM ErrorBoundary caught error]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-amber-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-[#B8860B] mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-6">
              An unexpected error occurred while loading this page. Please try refreshing.
            </p>
            {this.state.error?.message && (
              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-700 mb-6 text-left overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-[#B8860B] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1a1a1a] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
