import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { cardNumber } = await request.json();
    console.log("Número do cartão recebido:", cardNumber);

    // Lê o arquivo paymentcheck.json
    const filePath = path.join(process.cwd(), "src/data/paymentcheck.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { validCards } = JSON.parse(fileContent);
    console.log("Cartões válidos:", validCards);

    // Verifica se o cartão é válido
    const isValid = validCards.includes(cardNumber);
    console.log("Cartão é válido?", isValid);

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Erro ao verificar cartão:", error);
    return NextResponse.json(
      { error: "Erro ao verificar cartão" },
      { status: 500 }
    );
  }
}
