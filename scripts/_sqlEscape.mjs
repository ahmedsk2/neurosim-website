// MySQL/MariaDB string escaping for SQL dumps (the mysql_real_escape_string rule).
//
// Shared by scripts/export-for-phpmyadmin.mjs (and its verifier) so the escaping is a single
// source of truth. Operating on the JS string (code units) is correct for utf8mb4 OUTPUT: the
// only bytes that need escaping are single-byte ASCII specials (\0 \n \r \ ' " 0x1A); UTF-8
// multibyte sequences are all >= 0x80 and never collide with them, so they pass through unchanged
// and are written verbatim as UTF-8 by the caller. This makes the round-trip byte-faithful for
// AES-256-GCM ciphertext, JSON, and arbitrary @db.Text free-text.
export function escapeMysqlString(s) {
  return s.replace(/[\0\n\r\\'"\x1a]/g, (c) => {
    switch (c) {
      case '\0':
        return '\\0';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '\\':
        return '\\\\';
      case "'":
        return "\\'";
      case '"':
        return '\\"';
      case '\x1a':
        return '\\Z';
      default:
        return c;
    }
  });
}
