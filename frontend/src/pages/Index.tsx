import React, { useState } from 'react';
import { Brain, Zap, Shield, Award, ArrowRight } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ApiResults {
  relevant_resumes: string[];
  irrelevant_resumes: string[];
}

const Index = () => {
  const [jdFiles, setJdFiles] = useState<File[]>([]);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ApiResults | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (jdFiles.length === 0 || resumeFiles.length === 0) {
      toast({
        title: "Missing Files",
        description: "Please upload both a job description and at least one resume.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append('jd', jdFiles[0]);
    resumeFiles.forEach(file => {
      formData.append('resumes', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/screen_resumes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully processed ${resumeFiles.length} resumes.`,
      });
    } catch (err) {
      toast({
        title: "Processing Failed",
        description: "Failed to analyze resumes. Please check if the backend is running.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setJdFiles([]);
    setResumeFiles([]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Resume Screener</h1>
                <p className="text-sm text-muted-foreground">Intelligent candidate filtering powered by AI</p>
              </div>
            </div>
            
            {(jdFiles.length > 0 || resumeFiles.length > 0) && (
              <Button 
                variant="outline" 
                onClick={resetAll}
                className="text-sm"
              >
                Reset All
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-card border shadow-soft">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Lightning Fast</h3>
              <p className="text-xs text-muted-foreground">Process hundreds of resumes in seconds</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-card border shadow-soft">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Accurate Matching</h3>
              <p className="text-xs text-muted-foreground">AI-powered relevance scoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-card border shadow-soft">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Enterprise Ready</h3>
              <p className="text-xs text-muted-foreground">Secure and scalable solution</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-card rounded-xl p-6 shadow-medium border">
            <FileUpload
              accept=".pdf"
              multiple={false}
              onFilesChange={setJdFiles}
              title="Job Description"
              description="Upload the job description PDF to define requirements"
              files={jdFiles}
              maxFiles={1}
            />
          </div>

          <div className="bg-gradient-card rounded-xl p-6 shadow-medium border">
            <FileUpload
              accept=".pdf"
              multiple={true}
              onFilesChange={setResumeFiles}
              title="Resume Collection"
              description="Upload candidate resumes for AI screening"
              files={resumeFiles}
              maxFiles={20}
            />
          </div>
        </div>

        {/* Action Button */}
        {jdFiles.length > 0 && resumeFiles.length > 0 && !results && (
          <div className="text-center animate-fade-in">
            <div className="bg-gradient-card rounded-xl p-8 shadow-medium border">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Ready to Process</h3>
                  <p className="text-muted-foreground">
                    {resumeFiles.length} resume{resumeFiles.length !== 1 ? 's' : ''} will be analyzed against your job requirements
                  </p>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={cn(
                    "bg-gradient-primary hover:opacity-90 text-white px-8 py-3 text-base font-semibold rounded-lg transition-all duration-200 shadow-medium hover:shadow-strong",
                    loading && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing Resumes...
                    </>
                  ) : (
                    <>
                      Start AI Analysis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <ResultsDisplay results={results} loading={loading} />
      </main>
    </div>
  );
};

export default Index;