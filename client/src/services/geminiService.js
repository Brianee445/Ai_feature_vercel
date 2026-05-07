const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = "llama-3.3-70b-versatile"

const groqChat = async (messages) => {
  const response = await fetch(GROQ_URL, {
      method: "POST",
          headers: {
                "Content-Type": "application/json",
                      "Authorization": `Bearer ${GROQ_API_KEY}`
                          },
                              body: JSON.stringify({
                                    model: GROQ_MODEL,
                                          messages,
                                                max_tokens: 500,
                                                      temperature: 0.7
                                                          })
                                                            })

                                                              if (!response.ok) {
                                                                  const err = await response.json()
                                                                      throw new Error(err.error?.message || "Groq API error")
                                                                        }

                                                                          const data = await response.json()
                                                                            return data.choices[0].message.content
                                                                            }

                                                                            // Feature 1: Image analysis — mock fallback (Groq doesn't support vision)
                                                                            // TODO: swap to Gemini paid key in production
                                                                            export const analyzeProductImage = async (imageFile) => {
                                                                              const categories = ["Fashion", "Electronics", "Beauty", "Home & Living", "Food & Drinks"]
                                                                                const colors = ["Black", "White", "Brown", "Silver", "Red", "Blue"]
                                                                                  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
                                                                                    const randomColor = colors[Math.floor(Math.random() * colors.length)]

                                                                                      return new Promise((resolve) => {
                                                                                          setTimeout(() => {
                                                                                                resolve({
                                                                                                        category: randomCategory,
                                                                                                                keywords: ["product", "quality", "Nigeria", randomColor.toLowerCase()],
                                                                                                                        description: `A ${randomColor.toLowerCase()} ${randomCategory.toLowerCase()} item detected in the uploaded image.`,
                                                                                                                                color: randomColor,
                                                                                                                                        matchScore: Math.floor(Math.random() * 20) + 78
                                                                                                                                              })
                                                                                                                                                  }, 1500)
                                                                                                                                                    })
                                                                                                                                                    }

                                                                                                                                                    // Feature 2: Buyer chat assistant — live via Groq
                                                                                                                                                    export const askBuyerAssistant = async (question, history = []) => {
                                                                                                                                                      const messages = [
                                                                                                                                                          {
                                                                                                                                                                role: "system",
                                                                                                                                                                      content: "You are a helpful shopping assistant for ChequeMart, a Nigerian e-commerce marketplace. Help buyers find products, compare prices, and make purchase decisions. Keep responses short, friendly, and relevant to Nigerian shopping context. Plain text only, no markdown."
                                                                                                                                                                          },
                                                                                                                                                                              ...history.map((msg) => ({
                                                                                                                                                                                    role: msg.role === "model" ? "assistant" : msg.role,
                                                                                                                                                                                          content: msg.parts[0].text
                                                                                                                                                                                              })),
                                                                                                                                                                                                  { role: "user", content: question }
                                                                                                                                                                                                    ]

                                                                                                                                                                                                      return await groqChat(messages)
                                                                                                                                                                                                      }

                                                                                                                                                                                                      // Feature 2: Seller store advisor — live via Groq
                                                                                                                                                                                                      export const analyzeStoreForSeller = async (input, history = []) => {
                                                                                                                                                                                                        const messages = [
                                                                                                                                                                                                            {
                                                                                                                                                                                                                  role: "system",
                                                                                                                                                                                                                        content: "You are a store setup advisor for ChequeMart, a Nigerian e-commerce marketplace. When given a store link or description, suggest how a seller can recreate a similar aesthetic on ChequeMart. Give practical suggestions for layout style, color scheme, product arrangement, and store description tone. Keep it friendly and relevant to Nigerian vendors. Plain text only, no markdown."
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                ...history.map((msg) => ({
                                                                                                                                                                                                                                      role: msg.role === "model" ? "assistant" : msg.role,
                                                                                                                                                                                                                                            content: msg.parts[0].text
                                                                                                                                                                                                                                                })),
                                                                                                                                                                                                                                                    { role: "user", content: input }
                                                                                                                                                                                                                                                      ]

                                                                                                                                                                                                                                                        return await groqChat(messages)
                                                                                                                                                                                                                                                        }