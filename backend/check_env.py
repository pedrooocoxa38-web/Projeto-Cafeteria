"""
Script de verificação de ambiente
Verifica se todas as dependências estão instaladas corretamente
"""
import sys
import subprocess

def check_python_version():
    """Verifica versão do Python"""
    version = sys.version_info
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("⚠️  Aviso: Recomendado Python 3.8+")
        return False
    return True

def check_package(package_name):
    """Verifica se um pacote está instalado"""
    try:
        __import__(package_name)
        print(f"✅ {package_name}")
        return True
    except ImportError:
        print(f"❌ {package_name} NÃO INSTALADO")
        return False

def main():
    print("🔍 Verificando ambiente Python...\n")
    
    all_ok = True
    
    # Verifica Python
    if not check_python_version():
        all_ok = False
    
    print("\n📦 Verificando dependências:\n")
    
    # Lista de pacotes necessários
    packages = [
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "pydantic",
        "jose",
        "passlib"
    ]
    
    for package in packages:
        if not check_package(package):
            all_ok = False
    
    print("\n" + "="*50)
    
    if all_ok:
        print("✅ TUDO OK! Ambiente pronto para uso!")
        print("\n🚀 Para iniciar o servidor:")
        print("   uvicorn app:app --reload")
    else:
        print("⚠️  ATENÇÃO! Algumas dependências estão faltando.")
        print("\n📥 Para instalar:")
        print("   pip install -r requirements.txt")
    
    print("="*50)

if __name__ == "__main__":
    main()
