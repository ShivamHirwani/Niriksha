import React from "react";

export default function Home() {
  // Simple homepage layout
  return (
    <div className="p-6">
      <main className="flex flex-col items-center justify-center text-center mt-20 space-y-6">
        <h2 className="text-4xl font-semibold dark:text-white">
          Protect Students’ Learning Journey
        </h2>
        <p className="max-w-xl text-lg dark:text-white">
          EduGuard provides intelligent, early warnings for at-risk students by
          integrating attendance, assessment scores, and fee data in a simple
          dashboard.
        </p>
        <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
          Get Started
        </button>
      </main>

      <footer className="text-center p-6 text-sm dark:text-white">
        © 2025 EduGuard. All rights reserved.
      </footer>
    </div>
  );
}
