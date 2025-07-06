import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Target, Award, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">CitationTracker Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/dashboard">
                <Button>Try Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-6">
            First-to-Market AI Citation Tracking Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Stop Losing Customers to{" "}
            <span className="text-primary">Invisible AI Answers</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            CitationTracker Pro is the first platform to track when your content gets cited by AI search engines like Google SGE, ChatGPT, and Bing Chat. Finally, prove the ROI of your Answer Engine Optimization efforts and reclaim your visibility in the AI search era.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Free 14-Day Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Get Your Free AI Citation Audit
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            No credit card required • See your AI citation opportunities in under 5 minutes
          </p>
        </div>
      </section>

      {/* Supporting Copy */}
      <section className="py-16 px-6 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The search landscape has fundamentally changed. While you've been optimizing for traditional rankings, your competitors are being cited as "the answer" by AI engines that now handle over 40% of all searches. Every day you're not tracking AI citations is another day your brand becomes invisible to potential customers who never scroll past the AI-generated response.
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-0 shadow-custom-md text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Target className="h-8 w-8 text-primary mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">2.5M+</h3>
                <p className="text-sm text-muted-foreground">AI Citations Tracked</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-custom-md text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <TrendingUp className="h-8 w-8 text-accent mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">280%</h3>
                <p className="text-sm text-muted-foreground">Average Citation Increase</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-custom-md text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Users className="h-8 w-8 text-primary mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">500+</h3>
                <p className="text-sm text-muted-foreground">Marketing Teams</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-custom-md text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Award className="h-8 w-8 text-accent mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">$47M</h3>
                <p className="text-sm text-muted-foreground">Revenue Attributed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Transform from Invisible to Indispensable
            </h2>
            <p className="text-xl text-muted-foreground">
              Finally see where your brand really stands in AI search
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-bold text-foreground">Real-Time Citation Monitoring</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Track citations across 20+ AI platforms including Google SGE, ChatGPT, Bing Chat, and Perplexity. Get instant alerts when your content becomes "the answer" AI engines trust.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-bold text-foreground">Prove Your AEO ROI</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Connect AI citations directly to traffic, leads, and revenue with advanced attribution modeling. Stop guessing, start proving your Answer Engine Optimization works.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-bold text-foreground">Competitive Intelligence</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  See exactly how competitors dominate AI citations and reverse-engineer their success. Get the competitive intelligence that separates market leaders from followers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-bold text-foreground">AI-Powered Optimization</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Get specific recommendations for improving content to increase citation potential. Our AI analyzes millions of cited pieces to show you exactly what works.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Trusted by Forward-Thinking Marketing Leaders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardContent className="p-8">
                <p className="text-muted-foreground italic mb-4">
                  "CitationTracker Pro gave us the visibility we needed to prove our content strategy was working. In just three months, we increased our AI citations by 340% and can directly attribute $2.3M in pipeline to our AEO efforts."
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Sarah Chen</p>
                  <p className="text-muted-foreground">VP of Marketing, TechFlow Solutions</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardContent className="p-8">
                <p className="text-muted-foreground italic mb-4">
                  "The competitive intelligence alone is worth the investment. We can see exactly how our competitors are dominating AI citations and build strategies to outmaneuver them. It's like having a crystal ball for AEO."
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Jennifer Walsh</p>
                  <p className="text-muted-foreground">Content Strategy Director, GrowthCorp</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-primary text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to See Your AI Citation Opportunities?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join 500+ marketing teams already dominating AI search. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                Start Your Free 14-Day Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
          
          <p className="text-sm opacity-75 mt-6">
            No credit card required • Full access to all features • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 CitationTracker Pro. The first platform for AI citation tracking and Answer Engine Optimization.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;