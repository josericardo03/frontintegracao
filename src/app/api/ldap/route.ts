import LdapClient from "ldapjs-client";
import { NextRequest, NextResponse } from "next/server";

interface LdapEntry {
  displayName?: string[];
  mail?: string[];
  sAMAccountName?: string[];
}

export async function POST(request: Request) {
  const corpoEmTexto = await request.json();
  const username = corpoEmTexto.username;
  const password = corpoEmTexto.password;
  const domain = "desenvolvemt.local";
  const ldapUrl = "ldap://192.168.10.10:389";

  console.log("Tentando conectar ao LDAP:", ldapUrl);

  try {
    const client = new LdapClient({
      url: ldapUrl,
    });

    console.log("Tentando autenticar usuário:", username);
    await client.bind(username + "@" + domain, password);

    // Buscar informações adicionais do usuário
    console.log("Buscando informações do usuário");
    const searchResults = await client.search(`DC=desenvolvemt,DC=local`, {
      scope: "sub",
      filter: `(&(objectClass=user)(sAMAccountName=${username}))`,
      attributes: ["displayName", "mail", "sAMAccountName"],
    });

    let userData = null;
    for await (const entry of searchResults) {
      userData = {
        displayName: (entry as LdapEntry).displayName?.[0] || username,
        email: (entry as LdapEntry).mail?.[0] || "",
        username: (entry as LdapEntry).sAMAccountName?.[0] || username,
      };
      break;
    }

    console.log("Login bem sucedido para:", username);
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Erro na autenticação LDAP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Credenciais inválidas",
      },
      { status: 401 }
    );
  }
}
