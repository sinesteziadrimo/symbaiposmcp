"""Transfer a generated physical-menu image to the capability returned by Symbai MCP. No AI API."""
import argparse
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def upload(file_path, receipt_path, tenant_url):
    receipt = json.loads(Path(receipt_path).read_text(encoding="utf-8-sig"))
    receipt = receipt.get("data", receipt)
    target = urllib.parse.urlsplit(receipt["uploadURL"])
    tenant = urllib.parse.urlsplit(tenant_url)
    if tenant.scheme != "https" or not tenant.hostname or tenant.username or tenant.password:
        raise ValueError("tenant-url trebuie să fie adresa HTTPS verificată a instanței.")
    if (target.scheme, target.hostname, target.port or 443) != (tenant.scheme, tenant.hostname, tenant.port or 443):
        raise ValueError("URL-ul de transfer nu aparține tenantului verificat.")
    if target.username or target.password or target.query or target.fragment:
        raise ValueError("URL de transfer invalid.")
    if not re.fullmatch(r"/objects/uploads/physical-menu-[0-9a-f-]{36}\.(png|jpeg|webp)", target.path):
        raise ValueError("Calea nu este un transfer de fotografie pregătit de MCP.")
    if receipt.get("method") != "PUT" or receipt.get("contentType") not in ("image/png", "image/jpeg", "image/webp"):
        raise ValueError("Metodă sau tip de imagine invalid în răspunsul MCP.")
    expires = datetime.fromisoformat(receipt["expiresAt"].replace("Z", "+00:00"))
    if expires <= datetime.now(timezone.utc):
        raise ValueError("Transfer expirat. Recitește contextul și pregătește alt transfer cu același fișier.")
    source = Path(file_path)
    size = source.stat().st_size
    maximum = min(int(receipt["maxBytes"]), 12 * 1024 * 1024)
    if not 0 < size <= maximum:
        raise ValueError("Fișier gol sau peste limita transferului (maxim 12 MB).")
    data = source.read_bytes()
    if len(data) != size:
        raise ValueError("Fișierul s-a schimbat în timpul citirii.")
    detected = ("image/png" if data.startswith(b"\x89PNG\r\n\x1a\n") else
                "image/jpeg" if data.startswith(b"\xff\xd8\xff") else
                "image/webp" if data.startswith(b"RIFF") and data[8:12] == b"WEBP" else None)
    if detected != receipt["contentType"]:
        raise ValueError("Formatul fișierului nu corespunde fileType; pregătește transferul cu formatul corect.")
    request = urllib.request.Request(target.geturl(), data=data, method="PUT", headers={
        "Content-Type": detected, "Content-Length": str(len(data)),
    })
    opener = urllib.request.build_opener(NoRedirect())
    try:
        with opener.open(request, timeout=90) as response:
            if response.status != 200:
                raise ValueError("Transfer fără confirmare. Verifică attach_generated_menu_photo înainte de retry.")
    except (urllib.error.URLError, TimeoutError, OSError):
        # Do not print exceptions: urllib errors may include the temporary capability URL.
        raise ValueError("Transfer neconfirmat. Încearcă attach_generated_menu_photo cu același uploadId; dacă fișierul lipsește, pregătește alt transfer.") from None
    return {"status": "uploaded", "bytes": size, "uploadId": receipt["uploadId"],
            "nextTool": "attach_generated_menu_photo"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", required=True)
    parser.add_argument("--receipt", required=True)
    parser.add_argument("--tenant-url", required=True)
    args = parser.parse_args()
    try:
        print(json.dumps(upload(args.file, args.receipt, args.tenant_url), ensure_ascii=False))
    except ValueError as error:
        print(json.dumps({"status": "error", "message": str(error)}, ensure_ascii=False), file=sys.stderr)
        return 1
    except (OSError, KeyError, TypeError):
        print(json.dumps({"status": "error", "message": "Fișierul sau răspunsul MCP nu poate fi citit. Verifică datele locale."}), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

