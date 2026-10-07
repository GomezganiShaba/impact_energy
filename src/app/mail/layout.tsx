import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Webmail - mail.ies.engineer",
  description: "Official webmail client for Impact Energy Solution (ies.engineer)",
};

export default function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#08170F] text-[#FBE98F] antialiased selection:bg-[#F2B705] selection:text-[#08170F]">
      {children}
    </div>
  );
}
