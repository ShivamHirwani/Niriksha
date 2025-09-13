import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const App: React.FC = () => {
  // Header component
  const Header: React.FC = () => {
    return (
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Consulting</h1>
          <div className="space-x-2">
            <Button asChild variant="outline" className="text-primary-foreground border-primary-foreground">
              <a href="/login">Login</a>
            </Button>
            <Button asChild variant="outline" className="text-primary-foreground border-primary-foreground">
              <a href="/signup">Sign Up</a>
            </Button>
          </div>
        </div>
      </header>
    );
  };

  // Hero section
  const Hero: React.FC = () => {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Transform Your Business with AI</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Leverage cutting-edge AI solutions tailored to your needs. Our expert consultants help you unlock the full potential of artificial intelligence.
          </p>
          <Button asChild className="text-lg px-6 py-3">
            <a href="/signup">Get Started</a>
          </Button>
        </div>
      </section>
    );
  };

  // Features section
  const Features: React.FC = () => {
    const features = [
      {
        title: "Custom AI Solutions",
        description: "Bespoke AI models designed to address your unique business challenges.",
      },
      {
        title: "Data-Driven Insights",
        description: "Harness your data to make informed decisions with our advanced analytics.",
      },
      {
        title: "Expert Guidance",
        description: "Our team of AI specialists provides ongoing support and strategic advice.",
      },
    ];

    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Footer component
  const Footer: React.FC = () => {
    return (
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 AI Consulting. All rights reserved.</p>
        </div>
      </footer>
    );
  };

  // Home page component
  const Home: React.FC = () => {
    return (
      <>
        <Header />
        <Hero />
        <Features />
        <Footer />
      </>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
