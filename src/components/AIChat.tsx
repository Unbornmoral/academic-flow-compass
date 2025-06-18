
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI study assistant for Political Science at UniLag. I can help you with political science topics, constitutional law, international relations, public administration, research methods, and much more. I can also assist with assignments, explain complex theories, and provide study guidance. What would you like to learn about today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(inputMessage),
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Political Science Topics
    if (lowerQuestion.includes('democracy') || lowerQuestion.includes('democratic')) {
      return "Democracy is a form of government where power is vested in the people, who rule either directly or through freely elected representatives. Key principles include political equality, majority rule with minority rights, individual freedoms, and accountability. In Nigeria's context, we practice a federal democratic system with separation of powers. Would you like me to explain Nigerian democratic institutions or compare different democratic models?";
    }
    
    if (lowerQuestion.includes('constitution') || lowerQuestion.includes('constitutional law')) {
      return "A constitution is the supreme law that establishes the framework of government, defines governmental powers, and protects fundamental rights. Nigeria's 1999 Constitution (as amended) establishes a federal system with three tiers of government. It includes provisions for fundamental rights, directive principles, and federal character. What specific aspect of constitutional law would you like to explore?";
    }
    
    if (lowerQuestion.includes('federalism') || lowerQuestion.includes('federal')) {
      return "Federalism is a system of government where power is divided between a central authority and constituent political units. Nigeria practices fiscal federalism with exclusive, concurrent, and residual legislative lists. This allows for unity in diversity while addressing local needs. Would you like me to explain the challenges of Nigerian federalism or compare it with other federal systems?";
    }
    
    if (lowerQuestion.includes('political theory') || lowerQuestion.includes('political thought')) {
      return "Political theory examines fundamental questions about government, politics, liberty, justice, power, and authority. Key theorists include Plato (ideal state), Aristotle (classification of governments), Hobbes (social contract), Locke (liberal democracy), Rousseau (general will), and Marx (class struggle). African political thought includes scholars like Kwame Nkrumah and Julius Nyerere. Which theorist or concept interests you most?";
    }
    
    // International Relations
    if (lowerQuestion.includes('international relations') || lowerQuestion.includes('foreign policy')) {
      return "International Relations studies interactions between states, international organizations, and non-state actors. Key theories include Realism (power politics), Liberalism (cooperation and institutions), and Constructivism (ideas and identity). Nigeria's foreign policy is guided by principles like African unity, non-alignment, and economic diplomacy. What IR topic would you like to explore further?";
    }
    
    // Public Administration
    if (lowerQuestion.includes('public administration') || lowerQuestion.includes('civil service')) {
      return "Public Administration involves implementing government policies and managing public resources. It includes concepts like bureaucracy, new public management, good governance, and public service delivery. Nigeria's civil service operates on merit principles with challenges in capacity and efficiency. Would you like to discuss administrative reforms or comparative public administration?";
    }
    
    // Research Methods
    if (lowerQuestion.includes('research') || lowerQuestion.includes('methodology')) {
      return "Political Science research uses both quantitative and qualitative methods. Key approaches include surveys, case studies, comparative analysis, content analysis, and statistical methods. For your research, ensure you have a clear research question, literature review, appropriate methodology, and valid data sources. What specific research challenge are you facing?";
    }
    
    // Nigerian Politics
    if (lowerQuestion.includes('nigeria') || lowerQuestion.includes('nigerian politics')) {
      return "Nigerian politics is characterized by federalism, multi-party democracy, ethnic diversity, and oil dependency. Key issues include good governance, corruption, security challenges, and economic development. The Fourth Republic (1999-present) has seen democratic consolidation despite challenges. Which aspect of Nigerian politics would you like to discuss?";
    }
    
    // Comparative Politics
    if (lowerQuestion.includes('comparative politics') || lowerQuestion.includes('compare')) {
      return "Comparative Politics studies political systems, institutions, and processes across different countries. It helps us understand how different political arrangements work and their outcomes. We can compare presidential vs parliamentary systems, federal vs unitary states, or democratic transitions. What specific comparison are you interested in making?";
    }
    
    // Political Economy
    if (lowerQuestion.includes('political economy') || lowerQuestion.includes('economics')) {
      return "Political Economy examines the relationship between politics and economics, studying how political institutions affect economic outcomes and vice versa. Topics include development theories, resource curse, institutional economics, and globalization. Nigeria's political economy is shaped by oil dependency and federal resource allocation. What economic-political relationship interests you?";
    }
    
    // Assignment Help
    if (lowerQuestion.includes('assignment') || lowerQuestion.includes('essay') || lowerQuestion.includes('paper')) {
      return "I can help you with your political science assignments! For essays: 1) Start with a clear thesis statement, 2) Use credible academic sources (journals, books, reports), 3) Structure arguments logically with evidence, 4) Analyze rather than just describe, 5) Cite sources properly (APA/MLA style). What specific aspect of your assignment do you need help with?";
    }
    
    // Study Tips
    if (lowerQuestion.includes('study') || lowerQuestion.includes('exam') || lowerQuestion.includes('tips')) {
      return "Effective political science study tips: 1) Read widely from academic sources, 2) Engage with current affairs and relate to theories, 3) Practice analytical writing, 4) Participate in debates and discussions, 5) Create concept maps linking theories, 6) Use case studies to understand abstract concepts. What specific area are you preparing for?";
    }
    
    // General Political Science
    if (lowerQuestion.includes('political science') || lowerQuestion.includes('politics')) {
      return "Political Science is the systematic study of government, politics, political behavior, and power relations. It encompasses political theory, comparative politics, international relations, public administration, and political methodology. The discipline helps us understand how societies organize themselves and make collective decisions. What specific area of political science interests you most?";
    }
    
    // Default comprehensive response
    return "That's an interesting question! Political Science covers many areas including political theory, comparative politics, international relations, public administration, Nigerian politics, constitutional law, and research methods. I can help you understand complex concepts, analyze current events through political science lenses, assist with assignments, or guide your research. Could you be more specific about what aspect you'd like to explore? I'm here to help you succeed in your political science studies at UniLag!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">AI Study Assistant</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[280px] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about political science..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
