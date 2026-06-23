# Symbai Supplier - catalog MCP (ghid practic)

Sursa de adevar pentru sesiunea curenta este `tools/list`: citirile apar mereu, iar scrierile apar doar daca tokenul are modulul bifat. Nu inventa tool-uri daca nu apar in sesiune.

## Ordine recomandata

1. Verifica accesul cu `get_dashboard`.
2. Pentru date, foloseste intai tool-ul dedicat de citire/listare. SQL nu exista in Supplier MCP.
3. Pentru scriere, explica schimbarea si cere confirmare daca miscarea afecteaza bani, stoc, status de comanda, retur sau trimitere externa.
4. Dupa scriere, reciteste cu tool-ul de get/list si spune unde se vede in aplicatie.

## Citiri de baza
- `get_dashboard`, `list_products`, `get_product`, `list_clients`, `get_client`, `list_orders`, `get_order`, `list_stock_movements` - imaginea generala a tenantului furnizorului.
- Produse: `find_product_by_sku`, `list_low_stock_products`, `list_product_categories`, `list_product_lots`.
- Clienti: `get_client_stats`, `list_client_delivery_addresses`, `list_client_contacts`, `list_client_balances`.
- Comenzi: `get_pick_list`, `list_order_shipments`.
- Stocuri: `list_warehouses`, `get_warehouse_stock`, `list_purchase_orders`, `get_purchase_order`, `list_goods_receipts`, `list_inventory_counts`, `get_inventory_count`, `list_reorder_suggestions`.
- Preturi: `resolve_price`, `resolve_price_batch`, `list_client_prices`, `list_pricing`. Pretul final vine din motorul de preturi, nu se recalculeaza manual.
- Livrari: `list_delivery_zones`, `list_fleet_vehicles`, `list_active_drivers`, `get_driver_locations`, `list_driver_trips`, `get_trip`.
- Facturare: `list_invoices`, `get_invoice`, `list_payments`, `list_receivable_balances`, `list_returns`, `get_return`.
- Loialitate: `get_loyalty_config`, `list_loyalty_clients`, `get_client_loyalty`, `get_loyalty_rolling_total`, `get_loyalty_receipts`.
- CRM: `list_crm_stages`, `list_crm_leads`, `get_crm_lead`, `list_crm_activities`, `list_crm_conversations`, `get_crm_conversation`.
- Setari: `get_supplier_profile`, `get_business_config`, `list_supplier_users`, `list_supplier_roles`, `list_field_permission_groups`, `list_recurring_orders`.
- Marketing: `get_email_marketing_status` verifica doar SMTP. Campaniile si audientele raman in aplicatie pana cand sesiunea expune explicit tool-uri de campanie.

## Scrieri pe module
- `produse`: `create_product`, `update_product`, `create_product_lot`, `update_product_lot_status`, `adjust_product_stock`.
- `clienti`: `create_client`, `update_client`, `create_client_delivery_address`, `create_client_contact`, `recalculate_client_balance`.
- `comenzi`: `create_manual_order`, `update_order_status`, `add_order_item`, `update_order_item`, `remove_order_item`, `create_order_shipment`. Anularea unei comenzi cere confirmare explicita si elibereaza stocul rezervat.
- `stocuri`: `create_warehouse`, `set_stock_quantity`, `create_purchase_order`, `update_purchase_order_status`, `create_goods_receipt`, `create_inventory_count`, `record_inventory_count_item`, `finalize_inventory_count`. Ajustarea stocului, receptia si finalizarea inventarierii cer `confirm:true`.
- `preturi`: `upsert_client_price` pentru pret/discount per client si produs. Trimite fie `customPrice`, fie `discountPct`, nu ambele.
- `livrari`: `create_delivery_zone`, `update_delivery_zone`, `create_fleet_vehicle`, `update_fleet_vehicle`, `create_trip`, `assign_order_to_trip`.
- `facturare`: `create_invoice_from_order`, `register_invoice`, `record_payment`, `delete_payment`, `create_return`, `update_return_status`, `process_return_stock`. Retururile si platile sunt sensibile; cere confirmare pe suma/status.
- `loialitate`: `recompute_client_loyalty`, `recompute_all_loyalty`, `evaluate_contract_autoenroll`.
- `crm`: `create_crm_lead`, `update_crm_lead`, `create_crm_activity`, `complete_crm_activity`, `add_crm_note`, `reply_crm_conversation`.
- `setari`: `update_business_config`, `create_recurring_order`, `update_recurring_order`.

## Limite importante
- Modulul `productie` nu este expus in MCP Supplier in implementarea curenta; daca userul cere MPS/productie, trimite-l in aplicatie sau verifica `tools/list` pentru o versiune mai noua.
- Marketing MCP Supplier nu trimite campanii in implementarea curenta; `get_email_marketing_status` doar verifica SMTP.
- Comenzile nu au coloana directa de supplier; foloseste tool-urile de comenzi, care verifica tenantul prin client.
- Secretele sunt redactate; nu cere parole, tokenuri sau chei.

## Erori obisnuite

- `Permisiune insuficienta`: modulul de scriere nu este bifat pe token; adminul recreeaza tokenul din aplicatia Supplier.
- `Token MCP lipsa` sau HTTP 401: configurarea MCP nu trimite headerul `Authorization: Bearer <TOKEN>` sau tokenul a fost revocat.
- Lista goala la un modul: modulul poate fi dezactivat in configurarea businessului sau nu exista date.
