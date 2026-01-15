import React, { useState } from 'react';
import Header from './Header';
import NotificationDropdown from './NotificationDropdown';
import InputBox from './InputBox';
import ApprovalModal from './ApprovalModal';
import PreviewModal from './PreviewModal';
import ShareModal from './ShareModal';
import NewPostModal from './NewPostModal';
import { Sparkles, Wand2 } from 'lucide-react';

const AIContentStudio = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [idea, setIdea] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    platform: 'instagram',
    content: '',
    mediaType: 'text',
    mediaUrl: ''
  });

  const N8N_WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook-test/ai-content-studio';
  
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const generateContent = async () => {
    if (!idea.trim()) {
      alert('Please enter your idea first!');
      return;
    }

    if (!activeMode) {
      alert('Please select a content type (ChatGPT, Post, Image, or Video)');
      return;
    }

    setIsLoading(true);
    setGeneratedContent('');
    setGeneratedImage(null);

    try {
      const requestData = {
        text: idea,
        type: activeMode,
        user_id: 'user_' + Date.now(),
        image: uploadedImage,
        timestamp: new Date().toISOString()
      };

      console.log('Sending to N8N:', requestData);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('N8N Response:', data);
      
      if (activeMode === 'chatgpt') {
        setIdea(data.polished_text || data.output);
        setIsLoading(false);
        return;
      }

      if (activeMode === 'image' && data.image_data) {
        const imageUrl = data.image_data.startsWith('data:') 
          ? data.image_data 
          : `data:image/png;base64,${data.image_data}`;
        setGeneratedImage(imageUrl);
        setGeneratedContent(data.image_prompt || data.polished_text);
      } else {
        setGeneratedContent(data.polished_text || data.output);
      }
      
      setIdea(data.polished_text || data.output);
      
      const newRequest = {
        id: Date.now(),
        type: activeMode,
        content: data.polished_text || data.output,
        image: uploadedImage,
        generatedImage: activeMode === 'image' && data.image_data 
          ? (data.image_data.startsWith('data:') ? data.image_data : `data:image/png;base64,${data.image_data}`)
          : null,
        status: 'pending',
        timestamp: new Date().toISOString(),
        originalIdea: idea
      };
      
      setRequests(prev => [newRequest, ...prev]);
      
    } catch (error) {
      console.error('Error with N8N:', error);
      alert('Error connecting to automation. Falling back to Claude API...');
      await generateContentWithClaude();
    }

    setIsLoading(false);
  };

  const generateContentWithClaude = async () => {
    try {
      let promptText = '';
      
      if (activeMode === 'chatgpt') {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ 
              role: "user", 
              content: `Convert this idea into an optimized ChatGPT prompt. Make it detailed and effective. Return ONLY the prompt text:\n\n"${idea}"`
            }],
          })
        });
        const data = await response.json();
        promptText = data.content.map(item => item.text || "").join("");
        setGeneratedContent(promptText);
        setIdea(promptText);
        return;
      }
      
      else if (activeMode === 'post') {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ 
              role: "user", 
              content: `Create an engaging viral social media post for: "${idea}"\n\nInclude:\n- Catchy hook\n- 2-4 punchy sentences\n- Trending hashtags\n- Strategic emojis\n- Call-to-action\n\nReturn ONLY the post.`
            }],
          })
        });
        const data = await response.json();
        promptText = data.content.map(item => item.text || "").join("");
      }
      
      else if (activeMode === 'image') {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ 
              role: "user", 
              content: `Create a detailed image generation prompt for: "${idea}"\n\nInclude style, colors, composition, lighting, details. Return ONLY the prompt.`
            }],
          })
        });
        const data = await response.json();
        promptText = data.content.map(item => item.text || "").join("");
      }
      
      else if (activeMode === 'video') {
        if (!uploadedImage) {
          alert('Please upload an image first for video generation!');
          setIsLoading(false);
          return;
        }
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ 
              role: "user", 
              content: `Create a 15-second UGC video script for: "${idea}"\n\nFormat:\n[0-3s] Hook\n[3-10s] Content\n[10-15s] CTA\n\nReturn ONLY the script.`
            }],
          })
        });
        const data = await response.json();
        promptText = data.content.map(item => item.text || "").join("");
      }

      setGeneratedContent(promptText);
      setIdea(promptText);
      
      const newRequest = {
        id: Date.now(),
        type: activeMode,
        content: promptText,
        image: uploadedImage,
        generatedImage: null,
        status: 'pending',
        timestamp: new Date().toISOString(),
        originalIdea: idea
      };
      setRequests(prev => [newRequest, ...prev]);
      
    } catch (error) {
      console.error('Error with Claude API:', error);
      alert('Error generating content. Please try again.');
    }
  };

  const handleApproval = (request, approved) => {
    setRequests(prev => prev.map(r => 
      r.id === request.id ? { ...r, status: approved ? 'approved' : 'rejected' } : r
    ));
    
    if (approved) {
      setCurrentRequest(request);
      setShowApprovalModal(false);
      setShowShareModal(true);
    } else {
      setShowApprovalModal(false);
    }
  };

  const shareToSocial = (platform) => {
    alert(`✅ Content successfully posted to ${platform}!`);
    setShowShareModal(false);
    setIdea('');
    setUploadedImage(null);
    setUploadedFile(null);
    setGeneratedContent('');
    setGeneratedImage(null);
    setActiveMode(null);
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className={`min-h-screen ${bgColor} transition-all duration-500`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Header 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        pendingRequests={pendingRequests}
        setShowNewPostModal={setShowNewPostModal}
        cardBg={cardBg}
        textColor={textColor}
        textSecondary={textSecondary}
      />

      {showNotifications && (
        <NotificationDropdown
          pendingRequests={pendingRequests}
          setCurrentRequest={setCurrentRequest}
          setShowApprovalModal={setShowApprovalModal}
          setShowNotifications={setShowNotifications}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      <main className="relative max-w-5xl mx-auto px-6 py-16">
        <div className="text-center space-y-6 mb-16">
          <h2 className={`text-6xl font-black ${textColor} leading-tight mb-0`}>
            Transform Ideas into
          </h2>
          <h2 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Pure Magic ✨
          </h2>
          <p className={`text-xl ${textSecondary} max-w-2xl mx-auto font-medium`}>
            AI-powered content creation for ChatGPT prompts, social posts, images, and videos
          </p>
        </div>

        <InputBox
          idea={idea}
          setIdea={setIdea}
          uploadedImage={uploadedImage}
          handleImageUpload={handleImageUpload}
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          isLoading={isLoading}
          generateContent={generateContent}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />

        {activeMode && (
          <div className="mt-8 flex justify-center animate-slideUp">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl border-2 ${
              activeMode === 'chatgpt' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' :
              activeMode === 'post' ? 'bg-blue-100 border-blue-300 text-blue-800' :
              activeMode === 'image' ? 'bg-purple-100 border-purple-300 text-purple-800' :
              'bg-orange-100 border-orange-300 text-orange-800'
            } font-bold shadow-lg`}>
              {activeMode === 'chatgpt' && 'ChatGPT Prompt Generator'}
              {activeMode === 'post' && 'Viral Social Post Creator'}
              {activeMode === 'image' && 'AI Image Generator'}
              {activeMode === 'video' && 'UGC Video Script Writer'}
            </div>
          </div>
        )}

        {uploadedImage && (
          <div className="mt-6 flex justify-center animate-slideUp">
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-emerald-50 backdrop-blur-xl rounded-2xl border-2 border-emerald-300 shadow-lg">
              <img src={uploadedImage} alt="Uploaded" className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-300 shadow-md" />
              <div>
                <p className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                  ✅ Image Ready
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Perfect! Ready to generate
                </p>
              </div>
            </div>
          </div>
        )}

        {generatedImage && (
          <div className="mt-10 animate-slideUp">
            <div className={`${cardBg} backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200 shadow-2xl`}>
              <div className="flex items-center gap-3 mb-4">
                <Wand2 className="w-6 h-6 text-purple-600" />
                <h3 className={`text-xl font-bold ${textColor}`}>Generated Image</h3>
              </div>
              <img src={generatedImage} alt="Generated" className="w-full rounded-2xl shadow-lg" />
            </div>
          </div>
        )}
      </main>

      {showApprovalModal && currentRequest && (
        <ApprovalModal
          currentRequest={currentRequest}
          handleApproval={handleApproval}
          setShowApprovalModal={setShowApprovalModal}
          setShowPreview={setShowPreview}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      {showPreview && currentRequest && (
        <PreviewModal
          currentRequest={currentRequest}
          setShowPreview={setShowPreview}
          handleApproval={handleApproval}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      {showShareModal && currentRequest && (
        <ShareModal
          shareToSocial={shareToSocial}
          setShowShareModal={setShowShareModal}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      {showNewPostModal && (
        <NewPostModal
          newPost={newPost}
          setNewPost={setNewPost}
          setShowNewPostModal={setShowNewPostModal}
          shareToSocial={shareToSocial}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AIContentStudio;