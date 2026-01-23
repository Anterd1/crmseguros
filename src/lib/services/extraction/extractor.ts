import { ExtractedData } from "@/types/domain";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * This service sends a PDF file directly to Google Gemini to extract structured insurance data.
 * Gemini 1.5 Flash can read PDFs natively without text extraction.
 */
export async function extractDataFromPdf(buffer: Buffer, mimeType: string): Promise<ExtractedData> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback to mock data if no API key is present
    if (!apiKey) {
        console.warn("No GEMINI_API_KEY found. Using mock data.");
        return getMockData();
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert buffer to base64 for Gemini's file API
        const base64Data = buffer.toString('base64');

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType || 'application/pdf'
            }
        };

        const prompt = `
            Actúa como un experto en seguros y análisis de documentos.
            Analiza esta póliza de seguros y extrae la información en formato JSON estricto.
            
            Estructura requerida del JSON:
            {
              "client": {
                "type": "Física" o "Moral",
                "first_name": "Nombre o Razón Social",
                "rfc": "RFC si existe",
                "email": "Email si existe",
                "phone": "Teléfono si existe",
                "address": {
                  "street": "Calle y número",
                  "city": "Ciudad",
                  "state": "Estado",
                  "zipCode": "CP",
                  "neighborhood": "Colonia"
                }
              },
              "policy": {
                "policy_number": "Número de póliza",
                "company": "Nombre de la aseguradora (GNP, AXA, Mapfre, etc)",
                "type": "Ramo (Autos, Vida, GMM, etc)",
                "start_date": "YYYY-MM-DD",
                "end_date": "YYYY-MM-DD",
                "payment_frequency": "Mensual, Trimestral, Semestral, Anual o Pago Único",
                "financial_data": {
                  "netPremium": 0.00 (número),
                  "taxAmount": 0.00 (número),
                  "totalPremium": 0.00 (número),
                  "currency": "MXN, USD o EUR"
                }
              }
            }
            
            Si algún campo no se encuentra, déjalo como string vacío "" o 0.
            Responde SOLO con el JSON válido, sin bloques de código ni markdown.
        `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const textResponse = response.text();
        
        console.log("=== GEMINI RAW RESPONSE ===");
        console.log(textResponse);
        console.log("=== END RAW RESPONSE ===");
        
        // Clean markdown code blocks if Gemini sends them
        const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        console.log("=== CLEANED JSON ===");
        console.log(cleanJson);
        console.log("=== END CLEANED JSON ===");
        
        const extracted = JSON.parse(cleanJson);
        
        console.log("=== PARSED DATA ===");
        console.log(JSON.stringify(extracted, null, 2));
        console.log("=== END PARSED DATA ===");
        
        return {
            ...extracted,
            confidence_score: 0.95,
            raw_text: "PDF procesado directamente por IA"
        };

    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        return {
            ...getMockData(),
            confidence_score: 0
        };
    }
}

function getMockData(): ExtractedData {
    return {
        client: {
            first_name: "GRUPO JONDAL MX S DE RL DE CV",
            type: "Moral",
            rfc: "GJM160809LT9",
            legal_name: "GRUPO JONDAL MX S DE RL DE CV",
            address: {
                street: "AV. YUCATAN POR JOSE DIAZ BO",
                exteriorNumber: "",
                neighborhood: "Yucatán",
                city: "Mérida",
                state: "Yucatán",
                zipCode: "97135",
                country: "México"
            }
        },
        policy: {
            policy_number: "14622D07",
            company: "AXA",
            type: "GMM",
            status: "Activa",
            start_date: "2023-12-13",
            end_date: "2024-12-13",
            contract_date: "2023-11-09",
            payment_frequency: "Pago Único",
            financial_data: {
                netPremium: 19509.07,
                issuanceFee: 0,
                financingFee: 0,
                taxPercentage: 16,
                taxAmount: 3385.45,
                otherFees: 0,
                totalPremium: 24544.52,
                currency: "MXN"
            }
        },
        confidence_score: 0,
        raw_text: "Datos de demostración (sin API key)"
    };
}
