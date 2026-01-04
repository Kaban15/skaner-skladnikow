#!/usr/bin/env python3
"""
Skrypt do automatycznego wgrania aplikacji Skaner Skladnikow na serwer
"""

import paramiko
import os

# Konfiguracja serwera
SERVER = "72.62.52.81"
USERNAME = "root"
PASSWORD = "Ciapek515???"
REMOTE_PATH = "/var/www/sklad"

def main():
    print(f"Laczenie z serwerem {SERVER}...")

    # Utworzenie klienta SSH
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        # Polaczenie
        ssh.connect(SERVER, username=USERNAME, password=PASSWORD)
        print("Polaczono!")

        # Utworzenie struktury katalogow
        print("Tworzenie katalogow...")
        commands = [
            f"rm -rf {REMOTE_PATH}",
            f"mkdir -p {REMOTE_PATH}/css",
            f"mkdir -p {REMOTE_PATH}/js"
        ]
        for cmd in commands:
            stdin, stdout, stderr = ssh.exec_command(cmd)
            stdout.channel.recv_exit_status()

        print("Katalogi utworzone!")

        # SFTP do przesylania plikow
        sftp = ssh.open_sftp()

        # Lokalna sciezka do plikow
        local_base = os.path.dirname(os.path.abspath(__file__))

        # Lista plikow do przeslania
        files = [
            ("index.html", f"{REMOTE_PATH}/index.html"),
            ("css/style.css", f"{REMOTE_PATH}/css/style.css"),
            ("js/app.js", f"{REMOTE_PATH}/js/app.js"),
            ("js/scanner.js", f"{REMOTE_PATH}/js/scanner.js"),
            ("js/analyzer.js", f"{REMOTE_PATH}/js/analyzer.js"),
        ]

        for local_file, remote_file in files:
            local_path = os.path.join(local_base, local_file)
            print(f"Przesylanie {local_file}...")
            sftp.put(local_path, remote_file)

        sftp.close()
        print("Wszystkie pliki przeslane!")

        # Ustawienie uprawnien
        print("Ustawianie uprawnien...")
        ssh.exec_command(f"chmod -R 755 {REMOTE_PATH}")

        print("\n=== SUKCES! ===")
        print(f"Pliki zostaly wgrane do {REMOTE_PATH}")

    except Exception as e:
        print(f"BLAD: {e}")
        raise
    finally:
        ssh.close()

if __name__ == "__main__":
    main()
