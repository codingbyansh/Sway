
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OptionsSelector from './components/OptionsSelector';
import Button from './components/Button';
import ReplyCard from './components/ReplyCard';
import PremiumModal from './components/PremiumModal';
import GhostingRecovery from './components/GhostingRecovery';
import { Logo } from './components/Logo';
import { 
  InputMode, Tone, Language, GeneratedResponse, UserCredits, TextStyle 
} from './types';
import { INITIAL_CREDITS, MOCK_LOADING_MESSAGES } from './constants';
import { generateReplies } from './services/geminiService';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [credits, setCredits] = useState<UserCredits>({
    remaining: INITIAL_CREDITS,
    isPremium: false,
  });
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showGhostingModal, setShowGhostingModal] = useState(false); // New state for ghosting feature
  
  const [mode, setMode] = useState<InputMode>(InputMode.TEXT);
  const [textInput, setTextInput] = useState('');
  const [imageInput, setImageInput] = useState<string | null>(null);
  
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.CONFIDENT);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.HINGLISH);
  const [useEmojis, setUseEmojis] = useState<boolean>(true);
  const [textStyle, setTextStyle] = useState<TextStyle>(TextStyle.STANDARD);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(MOCK_LOADING_MESSAGES[0]);
  
  const [result, setResult] = useState<GeneratedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      let i = 0;
      interval = window.setInterval(() => {
        i = (i + 1) % MOCK_LOADING_MESSAGES.length;
        setLoadingMessage(MOCK_LOADING_MESSAGES[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // --- Handlers ---
  const handleGenerate = async () => {
    setError(null);

    // Validation
    if (mode === InputMode.TEXT && !textInput.trim()) {
      setError("Please paste a text message first.");
      return;
    }
    if (mode === InputMode.IMAGE && !imageInput) {
      setError("Please upload a screenshot first.");
      return;
    }

    // Credits Check
    if (credits.remaining <= 0 && !credits.isPremium) {
      setShowPremiumModal(true);
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await generateReplies(
        mode === InputMode.TEXT ? textInput : "",
        mode === InputMode.IMAGE ? imageInput : null,
        selectedTone,
        selectedLanguage,
        useEmojis,
        textStyle
      );

      setResult(response);
      
      // Deduct credit if not premium
      if (!credits.isPremium) {
        setCredits(prev => ({ ...prev, remaining: prev.remaining - 1 }));
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpgrade = () => {
    // Mock upgrade process
    setCredits({ remaining: 9999, isPremium: true });
    setShowPremiumModal(false);
    alert("Welcome to Sway Premium! 🚀");
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fafafa]">
      <Header 
        credits={credits} 
        onOpenPremium={() => setShowPremiumModal(true)} 
        onOpenGhosting={() => setShowGhostingModal(true)}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Input Configuration */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <InputModeSection 
                mode={mode} 
                setMode={setMode} 
                textInput={textInput}
                setTextInput={setTextInput}
                imageInput={imageInput}
                setImageInput={setImageInput}
              />
              
              <OptionsSelector 
                selectedTone={selectedTone}
                setSelectedTone={setSelectedTone}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                useEmojis={useEmojis}
                setUseEmojis={setUseEmojis}
                textStyle={textStyle}
                setTextStyle={setTextStyle}
              />

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
                  {error}
                </div>
              )}

              <Button 
                fullWidth 
                onClick={handleGenerate} 
                isLoading={isGenerating}
                disabled={isGenerating}
                className="h-14 text-lg shadow-sway-200"
              >
                {isGenerating ? loadingMessage : (
                  <span className="flex items-center">
                    <Sparkles size={20} className="mr-2" /> 
                    Generate Replies
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Hero or Results */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            {!result ? (
              <div className="flex flex-col items-center justify-center py-6 lg:py-20 text-center space-y-6">
                <div className="p-6 bg-white rounded-full shadow-lg shadow-pink-100 border border-pink-50 transform hover:scale-105 transition-transform duration-300">
                  <Logo className="w-20 h-20 md:w-24 md:h-24" />
                </div>
                <div className="space-y-3 max-w-lg mx-auto">
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                    Reply with <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Confidence</span>
                  </h1>
                  <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                    Your AI wingman for the perfect text. Upload a screenshot or paste a message to generate culturally tuned, charismatic replies instantly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
                {/* Analysis Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50 border border-blue-100 p-5 rounded-2xl gap-4">
                  <div>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                      AI Context Analysis
                    </p>
                    <div className="text-sm md:text-base text-gray-800">
                      <span className="font-semibold">{result.analysis.stage}</span> • {result.analysis.intent}
                    </div>
                  </div>
                  <div className="sm:text-right sm:max-w-[60%]">
                     <p className="text-sm text-gray-600 italic leading-relaxed">"{result.analysis.advice}"</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 ml-1">Suggested Replies</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {result.replies.map((reply) => (
                      <ReplyCard key={reply.id} reply={reply} />
                    ))}
                  </div>
                </div>

                <div className="text-center pt-4 lg:text-left">
                  <button 
                    onClick={handleGenerate}
                    className="text-sm font-medium text-gray-500 hover:text-sway-600 underline"
                  >
                    Not satisfied? Try generating again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-12"></div> {/* Spacer */}
      </main>

      {/* Modals */}
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handleUpgrade}
      />
      
      {showGhostingModal && (
        <GhostingRecovery onClose={() => setShowGhostingModal(false)} />
      )}
    </div>
  );
};

// Internal wrapper to prevent circular dependency mess if extracting InputSection purely
const InputModeSection: React.FC<any> = (props) => {
  return <InputSection {...props} />
}

export default App;
