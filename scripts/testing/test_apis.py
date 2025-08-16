#!/usr/bin/env python3
"""
🚀 Script para Testar APIs REST do Quiz Quest
Execute: python test_apis.py
"""

import requests
import json
import time
from datetime import datetime

# Configuração
BASE_URL = "http://localhost:3000/api"
TIMEOUT = 10

class QuizAPITester:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        
    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🎯 {title}")
        print(f"{'='*60}")
        
    def test_api(self, endpoint, description):
        """Testa um endpoint específico"""
        url = f"{self.base_url}{endpoint}"
        print(f"\n📡 Testando: {description}")
        print(f"URL: {url}")
        
        try:
            start_time = time.time()
            response = self.session.get(url)
            end_time = time.time()
            
            print(f"⏱️  Tempo de resposta: {(end_time - start_time)*1000:.0f}ms")
            print(f"📊 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    count = len(data.get('data', []))
                    print(f"✅ Sucesso! {count} registros encontrados")
                    
                    # Mostrar amostra dos dados se existirem
                    if count > 0:
                        print(f"📋 Amostra do primeiro registro:")
                        sample = data['data'][0]
                        for key, value in list(sample.items())[:3]:  # Primeiros 3 campos
                            print(f"   • {key}: {value}")
                        if len(sample.items()) > 3:
                            print(f"   ... e mais {len(sample.items()) - 3} campos")
                    
                    return True, data
                else:
                    print(f"❌ API retornou erro: {data}")
                    return False, data
            else:
                print(f"❌ Erro HTTP {response.status_code}: {response.text[:200]}")
                return False, None
                
        except requests.exceptions.ConnectionError:
            print("❌ Erro de conexão - Servidor não está rodando?")
            return False, None
        except requests.exceptions.Timeout:
            print("❌ Timeout - Servidor demorou para responder")
            return False, None
        except Exception as e:
            print(f"❌ Erro inesperado: {e}")
            return False, None
    
    def run_all_tests(self):
        """Executa todos os testes de API"""
        self.print_header("TESTADOR DE APIs - QUIZ QUEST")
        print(f"🔗 Base URL: {self.base_url}")
        print(f"⏰ Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Lista de endpoints para testar
        endpoints = [
            ("/quiz-results", "Resultados dos Quizzes"),
            ("/conversion-events", "Eventos de Conversão"),
            ("/hotmart-purchases", "Compras Hotmart"),
            ("/utm-analytics", "Analytics UTM"),
            ("/quiz-participants", "Participantes do Quiz"),
        ]
        
        results = []
        success_count = 0
        
        for endpoint, description in endpoints:
            success, data = self.test_api(endpoint, description)
            results.append({
                'endpoint': endpoint,
                'description': description,
                'success': success,
                'data_count': len(data.get('data', [])) if success and data else 0
            })
            if success:
                success_count += 1
        
        # Resumo final
        self.print_header("RESUMO DOS TESTES")
        print(f"✅ APIs funcionando: {success_count}/{len(endpoints)}")
        print(f"❌ APIs com problema: {len(endpoints) - success_count}/{len(endpoints)}")
        
        print(f"\n📊 Detalhamento:")
        for result in results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['endpoint']} - {result['description']} ({result['data_count']} registros)")
        
        if success_count == len(endpoints):
            print(f"\n🎉 PARABÉNS! Todas as APIs estão funcionando perfeitamente!")
        elif success_count > 0:
            print(f"\n⚠️  Algumas APIs estão funcionando. Verifique os erros acima.")
        else:
            print(f"\n🚨 ATENÇÃO! Nenhuma API está funcionando. Verifique se o servidor está rodando:")
            print(f"   1. Execute: npm run dev")
            print(f"   2. Verifique se a porta {self.base_url.split(':')[-1].split('/')[0]} está correta")
            print(f"   3. Teste manualmente: curl {self.base_url}/quiz-results")
        
        return results
    
    def test_specific_user(self, email):
        """Testa a jornada de um usuário específico"""
        self.print_header(f"JORNADA DO USUÁRIO: {email}")
        
        endpoint = f"/conversion-events/email/{email}"
        success, data = self.test_api(endpoint, f"Eventos do usuário {email}")
        
        if success and data.get('data'):
            events = data['data']
            print(f"\n📈 Jornada completa encontrada:")
            for i, event in enumerate(events, 1):
                timestamp = event.get('createdAt', 'N/A')
                event_type = event.get('eventType', 'N/A')
                value = event.get('value', 0)
                print(f"   {i}. {timestamp} - {event_type} (R$ {value})")
        
        return success, data

def main():
    """Função principal"""
    print("🚀 Iniciando teste das APIs REST...")
    
    # Criar instância do testador
    tester = QuizAPITester()
    
    # Executar todos os testes
    results = tester.run_all_tests()
    
    # Teste adicional: buscar jornada de um usuário exemplo
    print(f"\n" + "="*60)
    test_email = "user@example.com"
    tester.test_specific_user(test_email)
    
    print(f"\n🏁 Teste finalizado!")
    print(f"💡 Para visualizar os dados em um dashboard, abra: dashboard_analytics.html")

if __name__ == "__main__":
    main()
