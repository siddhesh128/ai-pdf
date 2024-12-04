"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
      {/* Left side animation - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-4 md:p-8">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur animate-pulse"></div>
          <div className="relative bg-black/20 backdrop-blur-xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Start Your Journey</h2>
            <p className="text-gray-300">Join BookCraft AI and unleash your creativity</p>
            {/* Floating elements animation */}
            <div className="absolute -z-10">
              <div className="animate-float-slow absolute h-20 w-20 rounded-full bg-blue-500/20 -top-10 -left-10"></div>
              <div className="animate-float-medium absolute h-16 w-16 rounded-full bg-purple-500/20 top-20 left-20"></div>
              <div className="animate-float-fast absolute h-12 w-12 rounded-full bg-pink-500/20 bottom-10 right-10"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side form - full width on mobile */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 min-h-screen md:min-h-0">
        <div className="w-full max-w-md px-4 md:px-0">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
              Join BookCraft AI
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Create your account and start crafting amazing books</p>
          </div>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200",
                headerTitle: "!text-white font-semibold",  // Force white color
                headerSubtitle: "!text-gray-200",  // Lighter gray for better visibility
                card: {
                  root: "!bg-gradient-to-br !from-[#1E293B] !to-[#0F172A] backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden [&>*]:!bg-transparent",
                  header: "!bg-transparent !text-white",  // Ensure header background is transparent
                  footer: "!bg-gradient-to-br !from-[#1E293B] !to-[#0F172A] !mt-0"
                },
                socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 transition-all duration-200 text-white border-none",
                socialButtonsBlockButtonText: "text-white font-medium",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-white/10 border-white/20 text-white focus:border-purple-500",
                footerActionLink: "text-purple-400 hover:text-purple-300 font-medium transition-colors",
                identityPreviewText: "text-white",
                formFieldError: "text-red-400",
                footerActionText: "text-gray-400",
                dividerText: "text-gray-400",
                dividerLine: "bg-gray-700",
                footer: "text-center space-y-3 !bg-gradient-to-br !from-[#1E293B] !to-[#0F172A] rounded-b-xl pt-4 !mt-0 [&>*]:!bg-transparent",
                footerPages: "flex justify-center gap-4 text-sm mt-4",
                footerPagesLink: "text-gray-400 hover:text-purple-400 transition-colors",
                footerAction: "flex items-center justify-center gap-2 bg-transparent",
                // Clerk branding section
                internal: {
                  piyvrh: "!border-t !border-gray-700/50 !my-4",
                  wf8x4b: "text-gray-400 text-sm",
                  "16vtwdp": "text-purple-400/70 text-xs mt-2 pb-4",
                  "16mc20d": "flex items-center justify-center gap-2",
                  "5ghyhf": "h-4 text-gray-400 hover:text-purple-400 transition-colors",
                  "157kcmm": "!pb-2 [&>*]:!bg-transparent",
                  y44tp9: "[&>*]:!bg-transparent",
                  df7v37: "[&>*]:!bg-transparent",
                  "1dauvpw": "!bg-gradient-to-br !from-[#1E293B] !to-[#0F172A] [&>*]:!bg-transparent",
                },
                root: {
                  base: "!bg-gradient-to-br !from-[#1E293B] !to-[#0F172A] [&>*]:!bg-transparent",
                  view: "!bg-transparent"
                }
              },
              layout: {
                socialButtonsPlacement: "bottom",
                helpPageUrl: "https://help.example.com",
                logoPlacement: "inside",
                shimmer: true,
                privacyPageUrl: "https://clerk.com/privacy",
                termsPageUrl: "https://clerk.com/terms",
              },
              variables: {
                colorBackground: "#1E293B",
                colorInputBackground: "rgba(255, 255, 255, 0.05)",
                colorAlphaBackground: "#0F172A"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}