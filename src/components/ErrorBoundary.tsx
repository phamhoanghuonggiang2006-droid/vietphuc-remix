import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 my-8 rounded-3xl bg-[#16121a] border-2 border-[#D4AF37]/40 text-center max-w-xl mx-auto shadow-2xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#c5a059]/20 text-[#e5c365] flex items-center justify-center border border-[#c5a059]/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#faedd0]">
            Đã có gián đoạn hiển thị
          </h3>
          <p className="text-xs text-stone-300 font-serif leading-relaxed">
            Hệ thống vừa ghi nhận một lỗi hiển thị giao diện. Bạn có thể nhấn nút bên dưới để khôi phục lại không gian làm việc.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#e5c365] text-stone-950 font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tải Lại Giao Diện</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
