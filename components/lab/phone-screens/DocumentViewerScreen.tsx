"use client";

export function DocumentViewerScreen() {
  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div
        className="flex min-h-[52px] items-center border-b px-3"
        style={{ borderColor: "#d8d0bd", backgroundColor: "#fffaf0" }}
      >
        <span className="text-[14px] font-bold uppercase" style={{ color: "#8b6f3d" }}>
          ServiceAgreement_2024.pdf
        </span>
      </div>

      {/* Document content */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ backgroundColor: "#fff" }}>
        <p className="mb-2 text-[17px] font-bold text-center" style={{ color: "#1a1a1a" }}>
          TERMS OF SERVICE
        </p>
        <p className="mb-2 text-[13px] text-center" style={{ color: "#66594a" }}>
          StreamPlus Media, Inc. · Effective January 1, 2024
        </p>

        <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "#1a1a1a" }}>
          <p>
            <strong>1. Acceptance of Terms.</strong> By creating an account or using StreamPlus services, you agree to be bound by these Terms of Service. Please read them carefully.
          </p>
          <p>
            <strong>2. Auto-Renewal.</strong> Your subscription automatically renews each month on your billing date. Charges will be made to your payment method on file unless you cancel at least 24 hours before the renewal date.
          </p>
          <p>
            <strong>3. Data Sharing.</strong> StreamPlus may share your viewing history and profile data with affiliated third-party advertising partners. You may opt out in Account Settings under Privacy.
          </p>
          <p>
            <strong>4. Cancellation.</strong> You may cancel your subscription at any time. You will retain access until the end of the current billing period. No partial refunds are issued.
          </p>
          <p>
            <strong>5. Arbitration.</strong> Any dispute arising from these Terms shall be resolved by binding arbitration rather than in a court of law. You waive your right to a jury trial.
          </p>
          <p>
            <strong>6. Price Changes.</strong> StreamPlus reserves the right to change subscription prices at any time. You will be notified 30 days in advance by email.
          </p>
          <p>
            <strong>7. Limitation of Liability.</strong> StreamPlus is not liable for any indirect, incidental, or consequential damages arising from use of the service.
          </p>
        </div>
      </div>
    </div>
  );
}
