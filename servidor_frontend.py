#!/usr/bin/env python3
"""
Servidor HTTP simples para servir o frontend da Pizzaria
Uso: python3 servidor_frontend.py
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configurações
PORT = 8080
FRONTEND_DIR = "src/frontend"

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP com suporte a CORS para permitir conexões com o backend"""
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    # Verificar se estamos no diretório correto
    if not os.path.exists(FRONTEND_DIR):
        print(f"❌ Diretório {FRONTEND_DIR} não encontrado!")
        print("Execute este script a partir da raiz do projeto Pizzaria")
        sys.exit(1)
    
    # Mudar para o diretório do frontend
    os.chdir(FRONTEND_DIR)
    
    # Verificar se index.html existe
    if not os.path.exists("index.html"):
        print("❌ Arquivo index.html não encontrado!")
        sys.exit(1)
    
    # Configurar servidor
    with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
        print("🍕 Servidor Frontend da Pizzaria")
        print("=" * 50)
        print(f"🌐 Servidor rodando em: http://localhost:{PORT}")
        print(f"📁 Servindo arquivos de: {os.getcwd()}")
        print("🔗 Acesse: http://localhost:8080")
        print("\n📝 Notas:")
        print("- Para funcionalidade completa, inicie também o backend Node.js")
        print("- Backend: cd backend && npm run dev")
        print("- Para parar: Ctrl+C")
        print("\n🚀 Iniciando servidor...")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor parado pelo usuário")
            print("Obrigado por usar a Pizzaria! 🍕")

if __name__ == "__main__":
    main()
