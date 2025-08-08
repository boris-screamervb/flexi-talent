import React from "react";
import { Button } from "@/components/ui/button";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("App crashed:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-background">
          <section className="max-w-md w-full rounded-xl border bg-card p-6 shadow-sm text-center">
            <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">We encountered an error. Please try again.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={this.handleReload}>Reload</Button>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children as any;
  }
}

export default ErrorBoundary;
