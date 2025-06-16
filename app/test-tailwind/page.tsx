import TailwindTest from '@/components/TailwindTest';

export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Tailwind CSS Debug Page
        </h1>
        <TailwindTest />
        
        <div className="mt-8 p-6 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="font-semibold">Framework:</span> Next.js 13.5.1
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Tailwind Version:</span> 4.1.10
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Build Tool:</span> Next.js with SWC
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">PostCSS:</span> Configured with Tailwind + Autoprefixer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}