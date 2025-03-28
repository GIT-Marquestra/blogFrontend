import React, { useEffect, useState } from 'react';
import { BookOpen, Database, Globe, Search } from 'lucide-react';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { useAuth } from './SignStateContext';
import { backend } from './../backendString';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital?: string[];
  region: string;
  population: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
    <div className="text-purple-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const CountryCard: React.FC<{ country: Country }> = ({ country }) => (
  <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col items-center hover:border-purple-500 transition-all duration-300">
    <img 
      src={country.flags.png} 
      alt={country.flags.alt || `Flag of ${country.name.common}`} 
      className="h-16 w-24 object-cover rounded mb-3 shadow-md"
    />
    <h3 className="text-white font-medium text-lg">{country.name.common}</h3>
    <p className="text-gray-400 text-sm">{country.capital?.[0] || 'N/A'}</p>
    <div className="flex justify-between w-full mt-2">
      <span className="text-purple-400 text-xs">{country.region}</span>
      <span className="text-gray-300 text-xs">{country.population.toLocaleString()}</span>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  const { isSignedIn, setIsSignedIn } = useAuth();
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('authToken');
    
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch(`${backend}/verify-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            // Token is valid, set signed in state
            setIsSignedIn(true);
          } else {
            // Token is invalid, remove from local storage and redirect to signin
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            setIsSignedIn(false);
            window.location.href = '/signin';
          }
        } catch (error) {
          console.error('Token verification error:', error);
          // Redirect to signin on error
          window.location.href = '/signin';
        }
      } else {
        // No token, redirect to signin
        window.location.href = '/signin';
      }
    };

    verifyToken();
  }, [setIsSignedIn]);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population');
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data = await response.json();
        // Sort countries by population (descending)
        const sortedCountries = data.sort((a: Country, b: Country) => b.population - a.population);
        
        setAllCountries(sortedCountries);
        setFilteredCountries(sortedCountries.slice(0, visibleCount));
        setHasMore(sortedCountries.length > visibleCount);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries data');
        setLoading(false);
      }
    };

    fetchCountries();
  }, [visibleCount]);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = allCountries.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (country.capital && country.capital[0].toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCountries(filtered.slice(0, visibleCount));
      setHasMore(filtered.length > visibleCount);
    } else {
      setFilteredCountries(allCountries.slice(0, visibleCount));
      setHasMore(allCountries.length > visibleCount);
    }
  }, [searchTerm, allCountries, visibleCount]);

  // Load more countries
  const handleLoadMore = () => {
    const newVisibleCount = visibleCount + 16;
    setVisibleCount(newVisibleCount);
    
    // Update filtered countries based on search term
    if (searchTerm) {
      const filtered = allCountries.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (country.capital && country.capital[0].toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCountries(filtered.slice(0, newVisibleCount));
      setHasMore(filtered.length > newVisibleCount);
    } else {
      setFilteredCountries(allCountries.slice(0, newVisibleCount));
      setHasMore(allCountries.length > newVisibleCount);
    }
  };

  const features: FeatureCardProps[] = [
    {
      icon: <BookOpen size={24} />,
      title: "Blog",
      description: "Write your thoughts and share with the world!"
    },
    {
      icon: <Database size={24} />,
      title: "API Integrations",
      description: "Ready-to-use API solutions with detailed documentation and examples."
    },
    {
      icon: <Globe size={24} />,
      title: "Global Coverage",
      description: "Explore data from countries around the world with our interactive visualizations."
    },
    {
      icon: <Search size={24} />,
      title: "Search",
      description: "Find exactly what you need with our powerful search and filtering capabilities."
    }
  ];

  // If not signed in, don't render the page
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative p-10">
      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center">
            Flash Global Data Explorer
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto text-center">
            Discover tech insights and explore global data with our REST Countries API integration.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-md mb-10">
            <input
              type="text"
              placeholder="Search countries by name, region or capital..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <Search size={20} />
            </div>
          </div>

          {/* Countries Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Explore Country Data
            </h2>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                <p className="mt-4 text-gray-400">Loading country data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {filteredCountries.length === 0 ? (
                  <p className="text-center text-gray-400">No countries match your search criteria</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredCountries.map((country, index) => (
                        <CountryCard key={index} country={country} />
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {hasMore && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleLoadMore}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                          Load More Countries
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
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