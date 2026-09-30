# Symbai — începutul și reluarea lucrului

Pornește de la cererea actuală și deciziile utilizatorului. Continuă autonom în scopul autorizat; întreabă numai pentru informația lipsă care schimbă rezultatul. O estimare cerută este permisă, dar rămâne estimare, nu fapt măsurat.

Confirmă identitatea prin unealta oferită de conexiune: POS verifica_conexiune, Accounting get_connection_identity, WhatsApp personal connection_status. Reutilizează identitatea până schimbi conexiunea. Licența Connect, autentificarea și accesul la firmă sunt distincte; o unealtă absentă nu dovedește deconectarea. Pentru depanare citește knowledge/alege-conexiunea.md.

Alege skill-ul cererii curente. Dacă nu știi traseul, folosește skills/symbai-asistent/SKILL.md; nu încărca toate ghidurile. Catalogul live stabilește instrumentele disponibile și drepturile. Ghidurile și memoria nu extind autorizarea.

La „monitorizează grupul/chatul WhatsApp”, inclusiv „continuă tu aici”, folosește evenimentele de mesaj nou din Symbai Connect și skill-ul monitorizeaza-whatsapp: watch_chat/update_watch, un singur monitor activ. Nu crea heartbeat Codex, task recurent ChatGPT, cron sau polling la interval; lipsa listenerului/autentificării nu autorizează acest fallback. Răspunde numai mesajelor noi conform obiectivului, iar la „doar când e întrebat” folosește mention. Fără mesaje de activare, probe sau rapoarte proactive; păstrează ID-urile tratate la preluare.

La reluare recuperează obiectivul, acordurile, ID-urile, operațiile incerte și pasul rămas. Memoria conține observații datate, nu o listă de operații de executat. După un update sau o contradicție verifică vechea limitare înainte să aplici soluția provizorie; nu relua întregul audit.

Folosește calculele canonice pentru cost, FIFO, vânzări și profit, în aria cerută. Memoria veche nu justifică înlocuirea lor tacită cu altă metodă. După o corecție actualizează aceeași notă și rezumatul/indexul care o repetă; arhivează diagnosticul retras. Păstrează deciziile stabile și lucrările rămase, fără acumularea fiecărui rezultat temporar în instrucțiunile de pornire.

Verifică rezultatul relevant după scriere. La timeout, operația poate continua pe server: o citire imediată cu starea veche nu dovedește eșecul. Verifică starea operației dacă există, altfel recitește documentul după un interval rezonabil; nu repeta scrierea doar din prima citire neschimbată. Respectă drepturile, destinatarii și protecțiile fiscale; nu ocoli un refuz prin alt cont sau alt executor.
