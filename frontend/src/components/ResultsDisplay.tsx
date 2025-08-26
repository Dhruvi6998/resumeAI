import React from 'react';
import { CheckCircle2, XCircle, Users, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  results: {
    relevant_resumes: string[];
    irrelevant_resumes: string[];
  } | null;
  loading: boolean;
}

export function ResultsDisplay({ results, loading }: ResultsDisplayProps) {
  if (loading) {
    return (
      <div className="bg-gradient-card rounded-xl p-8 shadow-medium border animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Processing Resumes</h3>
            <p className="text-sm text-muted-foreground">Our AI is analyzing and categorizing the resumes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const totalResumes = results.relevant_resumes.length + results.irrelevant_resumes.length;
  const relevantPercentage = totalResumes > 0 ? (results.relevant_resumes.length / totalResumes) * 100 : 0;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Stats Overview */}
      <div className="bg-gradient-card rounded-xl p-6 shadow-medium border">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Screening Results</h3>
            <p className="text-sm text-muted-foreground">AI-powered resume analysis complete</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-background/50">
            <div className="text-2xl font-bold text-foreground">{totalResumes}</div>
            <div className="text-sm text-muted-foreground">Total Resumes</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-success/10">
            <div className="text-2xl font-bold text-success">{results.relevant_resumes.length}</div>
            <div className="text-sm text-success">Relevant Match</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-muted-foreground">{relevantPercentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Match Rate</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Relevant Resumes */}
        <div className="bg-gradient-card rounded-xl shadow-medium border overflow-hidden">
          <div className="bg-gradient-success p-4 text-white">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-semibold">Relevant Resumes</h3>
                <p className="text-sm opacity-90">{results.relevant_resumes.length} candidates match the requirements</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {results.relevant_resumes.length > 0 ? (
              results.relevant_resumes.map((resume, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 transition-colors",
                    "animate-slide-up"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{resume}</p>
                    <p className="text-xs text-muted-foreground">Strong candidate match</p>
                  </div>
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No relevant resumes found</p>
              </div>
            )}
          </div>
        </div>

        {/* Irrelevant Resumes */}
        <div className="bg-gradient-card rounded-xl shadow-medium border overflow-hidden">
          <div className="bg-muted p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Non-matching Resumes</h3>
                <p className="text-sm text-muted-foreground">{results.irrelevant_resumes.length} candidates don't meet requirements</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {results.irrelevant_resumes.length > 0 ? (
              results.irrelevant_resumes.map((resume, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors",
                    "animate-slide-up"
                  )}
                  style={{ animationDelay: `${(results.relevant_resumes.length + index) * 0.1}s` }}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{resume}</p>
                    <p className="text-xs text-muted-foreground">Doesn't match criteria</p>
                  </div>
                  <div className="flex-shrink-0">
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">All resumes are relevant!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}