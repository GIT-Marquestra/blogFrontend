import React from 'react';
import { BookOpen, Database, Code, Rocket } from 'lucide-react';
import { HoverBorderGradient } from './ui/hover-border-gradient';



interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
    <div className="text-purple-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <Code size={40} />,
      title: 'Developer-Friendly APIs',
      description: 'Robust, well-documented APIs with easy integration and comprehensive support.'
    },
    {
      icon: <Database size={40} />,
      title: 'Scalable Infrastructure',
      description: 'High-performance, secure, and horizontally scalable backend architecture.'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Tech Insights Blog',
      description: 'In-depth articles, tutorials, and cutting-edge technology explorations.'
    },
    {
      icon: <Rocket size={40} />,
      title: 'Rapid Development',
      description: 'Accelerate your projects with our intuitive tools and comprehensive resources.'
    },
    {
      icon: <Code size={40} />,
      title: 'Developer-Friendly APIs',
      description: 'Robust, well-documented APIs with easy integration and comprehensive support.'
    },
    {
      icon: <Database size={40} />,
      title: 'Scalable Infrastructure',
      description: 'High-performance, secure, and horizontally scalable backend architecture.'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Tech Insights Blog',
      description: 'In-depth articles, tutorials, and cutting-edge technology explorations.'
    },
    {
      icon: <Rocket size={40} />,
      title: 'Rapid Development',
      description: 'Accelerate your projects with our intuitive tools and comprehensive resources.'
    },
    {
      icon: <Code size={40} />,
      title: 'Developer-Friendly APIs',
      description: 'Robust, well-documented APIs with easy integration and comprehensive support.'
    },
    {
      icon: <Database size={40} />,
      title: 'Scalable Infrastructure',
      description: 'High-performance, secure, and horizontally scalable backend architecture.'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Tech Insights Blog',
      description: 'In-depth articles, tutorials, and cutting-edge technology explorations.'
    },
    {
      icon: <Rocket size={40} />,
      title: 'Rapid Development',
      description: 'Accelerate your projects with our intuitive tools and comprehensive resources.'
    },
    {
      icon: <Code size={40} />,
      title: 'Developer-Friendly APIs',
      description: 'Robust, well-documented APIs with easy integration and comprehensive support.'
    },
    {
      icon: <Database size={40} />,
      title: 'Scalable Infrastructure',
      description: 'High-performance, secure, and horizontally scalable backend architecture.'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Tech Insights Blog',
      description: 'In-depth articles, tutorials, and cutting-edge technology explorations.'
    },
    {
      icon: <Rocket size={40} />,
      title: 'Rapid Development',
      description: 'Accelerate your projects with our intuitive tools and comprehensive resources.'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-16 text-center">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            CodeCraft Blog & API Hub
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Discover cutting-edge tech insights, powerful API integrations, 
            and innovative development techniques in one comprehensive platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center space-x-4 mb-16">
            <HoverBorderGradient>
              <BookOpen className="mr-2 inline" />
              Read Blog
            </HoverBorderGradient>

            <HoverBorderGradient>
              <Database className="mr-2 inline" />
              API Docs
            </HoverBorderGradient>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;