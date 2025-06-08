
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  SparklesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CloudArrowDownIcon,
  CpuChipIcon,
  ArrowRightIcon,
  CheckIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const Landing: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <DocumentTextIcon className="h-8 w-8" />,
      title: "CIT & VAT Filing",
      description: "Automated Corporate Income Tax and VAT return preparation with real-time calculations"
    },
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: "AI Tax Assistant",
      description: "Get instant answers to UAE tax questions with our intelligent assistant"
    },
    {
      icon: <CloudArrowDownIcon className="h-8 w-8" />,
      title: "PDF & XML Export",
      description: "FTA-compliant exports in multiple formats including official PDF submissions"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "FTA Integration",
      description: "Direct integration with Federal Tax Authority systems for seamless compliance"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Financial Reports",
      description: "Comprehensive financial reporting with balance sheets and income statements"
    },
    {
      icon: <CpuChipIcon className="h-8 w-8" />,
      title: "Transfer Pricing",
      description: "Advanced transfer pricing documentation and compliance management"
    }
  ];

  const benefits = [
    "Save 20+ hours per month on tax compliance",
    "Reduce filing errors by 95% with automated validation",
    "Real-time tax calculations and liability tracking",
    "Complete audit trail for FTA inspections",
    "Multi-language support (English & Arabic)",
    "Role-based access for teams and accountants"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Peergos
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/setup"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                to="/setup"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Login to App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-8">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              FTA Compliant & Certified
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              UAE Tax Compliance
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              The most advanced tax compliance platform for UAE SMEs. Automate your CIT and VAT filings, 
              get AI-powered tax guidance, and ensure 100% FTA compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/setup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Start Free – No Credit Card Needed
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center">
                <PlayIcon className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Demo Screenshots Placeholder */}
            <div className="relative max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="h-96 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center">
                    <ChartBarIcon className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Live Dashboard Preview</p>
                    <p className="text-gray-400 text-sm mt-2">Real-time tax compliance monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for UAE tax compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From automated calculations to FTA submissions, Peergos handles every aspect of your tax obligations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:bg-gray-100 transition-colors group"
              >
                <div className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why SMEs choose Peergos
              </h2>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                Join thousands of UAE businesses who trust Peergos for their tax compliance needs.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-indigo-100 mb-6">Error Reduction</div>
                
                <div className="text-4xl font-bold text-white mb-2">20+</div>
                <div className="text-indigo-100 mb-6">Hours Saved Monthly</div>
                
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-indigo-100">FTA Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to simplify your UAE tax compliance?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Start your free trial today. No credit card required, no setup fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/setup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Get Started Free
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
            
            <Link
              to="/assistant"
              className="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              Try AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Peergos</span>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/setup" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link to="/assistant" className="text-gray-600 hover:text-gray-900 transition-colors">
                AI Assistant
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2025 Peergos. UAE Federal Tax Authority Compliant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
