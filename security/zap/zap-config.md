# zap-baseline rule configuration file
# Change WARN to IGNORE to ignore rule or FAIL to fail if rule matches
# Only the rule identifiers are used - the names are just for info

10021	FAIL	(X-Content-Type-Options Header Missing)
10037	IGNORE	(Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s))
10049	IGNORE	(Storable and Cacheable Content)
10055	IGNORE	(CSP: Failure to Define Directive with No Fallback)
10063	IGNORE	(Permissions Policy Header Not Set)
90004	IGNORE	(Cross-Origin-Resource-Policy Header Missing or Invalid)