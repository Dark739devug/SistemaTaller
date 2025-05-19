namespace Sistemaserviciostaller.Services
{
    public static class TokenBlacklist
    {
        private static HashSet<string> _blacklist = new();

        public static void Add(string token) => _blacklist.Add(token);

        public static bool Contains(string token) => _blacklist.Contains(token);
    }
}
