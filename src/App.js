import { useEffect, useState } from "react";
import feather from "feather-icons";
import "./App.css";
import Navbar from "./navbar";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="bg-gray-50 font-inter min-h-screen">
      {/* Navigation */}
      <Navbar />




      {/* HERO (gradient, big headline + CTA) */}
      < section className="hero" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-inner">
            <h1 className="hero-h1">Hire fairly. Move faster.</h1>
            <p className="hero-sub">
              TalentIQ uses AI-powered hybrid scoring to eliminate bias and
              surface the best candidates faster.
            </p>
            <a href="/jobs" className="hero-btn">
              View Jobs
              <i data-feather="arrow-right" className="ml-2 w-5 h-5"></i>
            </a>
          </div>
        </div>
      </section >

      {/* PROBLEM / SOLUTION (always horizontal 3 cards) */}
      < section className="ps-section" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-10">
            <h2 className="ps-h2">From Hiring Headaches to Hiring Heroes</h2>
            <p className="ps-sub">
              Traditional hiring is broken. We're fixing it with intelligent, transparent candidate evaluation.
            </p>
          </header>

          <div className="features-row">
            <article className="feature-card">
              <div className="feature-icon feature-icon-red">
                <i data-feather="filter"></i>
              </div>
              <h3 className="feature-title">Opaque Filtering</h3>
              <p className="feature-body">
                Resume keyword matching misses qualified candidates and introduces unconscious bias.
              </p>
              <a className="feature-link" href="#rubric">
                Solution: Weighted Rubric <i data-feather="arrow-right" className="w-4 h-4"></i>
              </a>
            </article>

            <article className="feature-card">
              <div className="feature-icon feature-icon-amber">
                <i data-feather="users"></i>
              </div>
              <h3 className="feature-title">Recruiter Overload</h3>
              <p className="feature-body">
                Manual screening of hundreds of applications is time-consuming and inconsistent.
              </p>
              <a className="feature-link" href="#scoring">
                Solution: Explainable Scoring <i data-feather="arrow-right" className="w-4 h-4"></i>
              </a>
            </article>

            <article className="feature-card">
              <div className="feature-icon feature-icon-indigo">
                <i data-feather="eye-off"></i>
              </div>
              <h3 className="feature-title">No Transparency</h3>
              <p className="feature-body">
                Candidates and hiring teams lack visibility into why decisions were made.
              </p>
              <a className="feature-link" href="#views">
                Solution: Dual Views <i data-feather="arrow-right" className="w-4 h-4"></i>
              </a>
            </article>
          </div>
        </div>
      </section >

      {/* PRODUCT MOCKUPS (kept horizontal) */}
      < section className="py-16 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">See TalentIQ in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intuitive interface makes complex candidate evaluation simple and transparent.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 items-start">
            {/* Job Overview Mock */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="bg-gray-100 p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Data Analyst - Job Overview</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex space-x-2 mb-4">
                    <div className="bg-fuchsia-100 text-fuchsia-800 text-xs px-2 py-1 rounded">Applied: 24</div>
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Screen: 8</div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Interview: 3</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 font-bold text-sm">1</div>
                        <div className="ml-3">
                          <p className="font-medium">Sarah Chen</p>
                          <p className="text-sm text-gray-500">83% Match</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Shortlisted</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                        <div className="ml-3">
                          <p className="font-medium">Marcus Johnson</p>
                          <p className="text-sm text-gray-500">76% Match</p>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Screening</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Compare Mock */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="bg-gray-100 p-4 border-b">
                  <h3 className="font-semibold">Candidate Comparison</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 font-bold mx-auto mb-2">SC</div>
                      <p className="font-medium">Sarah Chen</p>
                      <p className="text-2xl font-bold text-fuchsia-600">83%</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mx-auto mb-2">MJ</div>
                      <p className="font-medium">Marcus Johnson</p>
                      <p className="text-2xl font-bold text-blue-600">76%</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-600">
                      Sarah shows stronger Python and Pandas expertise, while Marcus has more AWS experience. Both candidates
                      meet the minimum requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Logos (kept horizontal) */}
      < section className="py-16 bg-gray-50" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-gray-500 mb-4">TRUSTED BY FORWARD-THINKING COMPANIES</h3>
          </div>
          <div className="grid grid-cols-6 gap-8 items-center opacity-60">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="flex justify-center" key={i}>
                <div className="h-12 bg-gray-200 rounded-lg w-32" />
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* FAQ */}
      < section className="py-16 bg-white" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about TalentIQ</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How does the hybrid scoring work?</h3>
              <p className="text-gray-600">
                Our algorithm combines weighted rubric scoring (55%), semantic analysis (25%), experience matching (10%),
                and gap penalties (10%) to provide a comprehensive and fair candidate evaluation.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I customize the scoring weights?</h3>
              <p className="text-gray-600">
                Yes! The Settings page allows you to adjust the α, β, γ, and δ parameters to match your hiring priorities and
                requirements.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Is candidate data secure?</h3>
              <p className="text-gray-600">
                Absolutely. We use enterprise-grade security with encryption at rest and in transit, and offer PII redaction options
                for exports.
              </p>
            </div>
          </div>
        </div>
      </section >

      {/* Final CTA */}
      < section className="py-16 gradient-bg text-white" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your hiring process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join companies using TalentIQ to hire better candidates faster with less bias.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-fuchsia-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Get Started Now
            <i data-feather="arrow-right" className="ml-2"></i>
          </a>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-gray-900 text-white py-12" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold text-white">TalentIQ</span>
              <p className="text-gray-400 mt-2">Hire fairly. Move faster.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TalentIQ. All rights reserved.</p>
          </div>
        </div>
      </footer >
    </div >
  );
}
