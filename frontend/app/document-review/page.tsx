"use client";

import { SetStateAction, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Menu,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from 'next/link'

const EXAMPLE_SOP = `I am writing to express my strong interest in pursuing a Master's degree in Computer Science at the University of Toronto. Having completed my Bachelor's degree in Computer Engineering from Tribhuvan University with a GPA of 3.8/4.0, I am eager to advance my knowledge in artificial intelligence and machine learning.

My fascination with AI began during my third year when I worked on a Natural Language Processing project for Nepali language sentiment analysis. This project, which achieved 87% accuracy using LSTM networks, was published in the International Conference on Machine Learning Applications 2024. The experience of adapting English-based NLP models to low-resource languages like Nepali ignited my passion for making AI accessible globally.

Canada, particularly the University of Toronto, stands out as my preferred destination for several specific reasons. First, Professor Raquel Urtasun's research in computer vision and autonomous systems aligns perfectly with my research interests. Second, the Vector Institute's focus on AI commercialization would provide invaluable industry connections. Third, Canada's multicultural environment and post-graduation work opportunities make it ideal for international students like myself.

My short-term goal is to contribute to cutting-edge research in multilingual NLP during my Master's program, potentially under Professor Graeme Hirst's supervision. Long-term, I aspire to return to Nepal and establish an AI research lab focused on developing language technologies for underrepresented languages in South Asia.

I believe my strong academic background, research experience, and clear vision make me a strong candidate for your program. I am confident that the University of Toronto's world-class faculty and research facilities will help me achieve my goals while allowing me to contribute unique perspectives from my Nepali background.`;

const EXAMPLE_RESUME = `RAJAN SHARMA
Kathmandu, Nepal | rajan.sharma@email.com | +977-9841234567 | linkedin.com/in/rajansharma

EDUCATION
Bachelor of Engineering in Computer Science                    Expected May 2024
Tribhuvan University, Institute of Engineering                  GPA: 3.7/4.0
Relevant Coursework: Data Structures, Algorithms, Machine Learning, Database Systems

TECHNICAL SKILLS
Languages: Python, Java, JavaScript, C++, SQL
Frameworks: React, Node.js, Django, TensorFlow, PyTorch
Tools: Git, Docker, AWS, MongoDB, PostgreSQL
Other: RESTful APIs, Agile/Scrum, Linux, CI/CD

WORK EXPERIENCE
Software Engineering Intern                                     Jun 2023 - Aug 2023
Tech Solutions Pvt. Ltd., Kathmandu
- Responsible for developing web applications
- Worked with team to create features
- Used various technologies

Student Developer                                               Jan 2023 - May 2023
University Innovation Lab
- Helped build mobile application
- Fixed bugs and improved performance
- Collaborated with other students

PROJECTS
E-commerce Platform
- Created full-stack e-commerce website using MERN stack
- Implemented user authentication and payment processing
- Used responsive design for mobile compatibility

AI Chatbot
- Built chatbot using Python and NLP
- Trained model on custom dataset
- Deployed on AWS`;

export default function DocumentReviewPage() {
  const [documentText, setDocumentText] = useState("");
  const [documentType, setDocumentType] = useState<
    "sop" | "resume" | "cover-letter"
  >("sop");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remainingReviews, setRemainingReviews] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const wordCount = documentText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const charCount = documentText.length;

  const handleSubmit = async () => {
    if (!documentText.trim()) {
      setError("Please enter your document text");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch("/api/review-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText,
          documentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(
            `Rate limit exceeded. You've used all 5 reviews for today. ` +
            `Try again after ${new Date(data.retryAfter).toLocaleString()}`
          );
        } else {
          setError(data.error || "Failed to generate review");
        }
        return;
      }

      setFeedback(data.feedback);
      setScore(data.score);
      setRemainingReviews(data.remainingReviews);
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Review error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyFeedback = () => {
    if (feedback) {
      navigator.clipboard.writeText(feedback);
    }
  };

  const handleLoadExample = (type: "sop" | "resume") => {
    setDocumentType(type);
    setDocumentText(type === "sop" ? EXAMPLE_SOP : EXAMPLE_RESUME);
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Enhanced Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
            Admitto
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <Link href="/scholarships" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Scholarships
            </Link>
            <Link href="/visa-guide" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Visa Guide
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Jobs
            </Link>
            <Link href="/ask-ai" className="text-gray-700 hover:text-primary transition-smooth font-medium">
              Ask AI
            </Link>
            <Link href="/document-review" className="text-primary font-semibold">
              Document Review
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-smooth"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white animate-slide-down">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link href="/scholarships" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium" onClick={() => setMobileMenuOpen(false)}>
                Scholarships
              </Link>
              <Link href="/visa-guide" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium" onClick={() => setMobileMenuOpen(false)}>
                Visa Guide
              </Link>
              <Link href="/jobs" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium" onClick={() => setMobileMenuOpen(false)}>
                Jobs
              </Link>
              <Link href="/ask-ai" className="px-4 py-3 hover:bg-gray-50 rounded-lg transition-smooth font-medium" onClick={() => setMobileMenuOpen(false)}>
                Ask AI
              </Link>
              <Link href="/document-review" className="px-4 py-3 bg-primary/10 text-primary rounded-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
                Document Review
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Header */}
      <section className="relative bg-gradient-warm text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <FileText className="h-16 w-16 mx-auto mb-4 animate-float" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">AI Document Review</h1>
          <p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto mb-6">
            Get expert-level feedback on your SOP, resume, or cover letter in
            seconds. Powered by advanced AI trained on thousands of successful
            applications.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center items-center">
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-smooth">
              <Sparkles className="h-4 w-4 mr-1" />
              Expert-Level Analysis
            </Badge>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-smooth">
              <CheckCircle className="h-4 w-4 mr-1" />
              Instant Feedback
            </Badge>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-smooth">
              5 Free Reviews/Day
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column: Input */}
            <div>
              <Card className="mb-6 hover-lift border-purple-200 bg-white transition-smooth">
                <CardHeader>
                  <CardTitle className="font-heading">Your Document</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Document Type Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Document Type
                    </label>
                    <Tabs
                      value={documentType}
                      onValueChange={(v) => setDocumentType(v as "sop" | "resume" | "cover-letter")}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="sop">SOP</TabsTrigger>
                        <TabsTrigger value="resume">Resume</TabsTrigger>
                        <TabsTrigger value="cover-letter">
                          Cover Letter
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Text Area */}
                  <Textarea
                    value={documentText}
                    onChange={(e: {
                      target: { value: SetStateAction<string> };
                    }) => setDocumentText(e.target.value)}
                    placeholder={
                      documentType === "sop"
                        ? "Paste your Statement of Purpose here..."
                        : documentType === "resume"
                          ? "Paste your resume text here..."
                          : "Paste your cover letter here..."
                    }
                    className="min-h-[400px] font-mono text-sm"
                  />

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !documentText.trim()}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get Feedback
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDocumentText("");
                        setFeedback(null);
                        setError(null);
                      }}
                    >
                      Clear
                    </Button>
                  </div>

                  {remainingReviews !== null && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {remainingReviews} reviews remaining today
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Examples */}
              <Card className="hover-lift border-blue-200 bg-gradient-to-br from-blue-50 to-white transition-smooth">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Try an Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadExample("sop")}
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Load Example SOP
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadExample("resume")}
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Load Example Resume
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    These examples contain common mistakes to demonstrate the
                    feedback quality.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Feedback */}
            <div>
              {error && (
                <Card className="mb-6 border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900">Error</h3>
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {feedback ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Expert Feedback</CardTitle>
                        {score && (
                          <Badge
                            variant={
                              score >= 80
                                ? "default"
                                : score >= 60
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="mt-2"
                          >
                            Score: {score}/100
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyFeedback}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{feedback}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your feedback will appear here after analysis</p>
                    <p className="text-sm mt-2">
                      Paste your document and click &quot;Get Feedback&quot;
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Tips Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Tips for Best Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Paste your complete document (not just excerpts)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Include all sections (intro, body, conclusion)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>
                      Review the feedback carefully and implement suggestions
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>You can review the same document multiple times</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
