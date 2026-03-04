# DNS Connections
**OVERVIEW**
DNS `(Domain Name System)` is like a phone book for the internet. It translates human-readable domain names (e.g. `google.com`) into IP addresses (e.g. `142.250.80.46`) that computers use to communicate with each other.
Without DNS, you would need to memorize IP addresses for every website or service you want to connect to.

## TABLE OF CONTENTS
1. [HOW DNS WORKS](#how-dns-works)
2. [TYPES OF DNS RECORDS](#types-of-dns-records)
3. [SRV RECORDS AND MONGODB ATLAS](#srv-records-and-mongodb-atlas)
4. [DNS SERVERS](#dns-servers)
5. [COMMON DNS COMMANDS](#common-dns-commands)
6. [DNS AND THIS PROJECT](#dns-and-this-project)

## How DNS Works

1. You type a domain name (e.g. `google.com`) into your browser
2. Your computer asks a **DNS resolver** (usually provided by your ISP) "what is the IP for google.com?"
3. The resolver checks its cache or queries other DNS servers to find the answer
4. It returns the IP address to your computer
5. Your computer connects to that IP address

```
Your Computer → DNS Resolver → Root DNS → TLD DNS → Authoritative DNS → IP Address
```
---

## TYPES OF DNS RECORDS

| Record Type | Purpose | Example |
|---|---|---|
| **A** | Maps a domain to an IPv4 address | `example.com → 93.184.216.34` |
| **AAAA** | Maps a domain to an IPv6 address | `example.com → 2606:2800::1` |
| **CNAME** | Aliases one domain to another | `www.example.com → example.com` |
| **MX** | Routes email to mail servers | `mail.example.com` |
| **SRV** | Locates services (used by MongoDB Atlas) | `_mongodb._tcp.cluster.mongodb.net` |
| **TXT** | Stores text data (used for verification) | Domain ownership proof |

---

## SRV Records and MongoDB Atlas

MongoDB Atlas uses the `mongodb+srv://` connection protocol, which relies on **SRV DNS records** to discover database servers.

When you connect with a string like:
```
mongodb+srv://user:password@cluster-one.0kjnxst.mongodb.net/
```

Your computer performs an SRV lookup:
```
_mongodb._tcp.cluster-one.0kjnxst.mongodb.net
```

This SRV record returns the actual hostnames and ports of the MongoDB servers in the cluster.

### Why SRV Lookups Fail

| Cause | Symptom | Fix |
|---|---|---|
| DNS server doesn't support SRV | `querySrv ECONNREFUSED` | Change to Google/Cloudflare DNS |
| VPN blocking DNS queries | Timeout or ECONNREFUSED | Disconnect VPN |
| Corporate/university firewall | Connection refused | Use a personal hotspot |
| Stale DNS cache | Intermittent failures | Run `ipconfig /flushdns` |

---

## DNS SERVERS

Your DNS server is the service that resolves domain names. By default, your ISP assigns one automatically, but you can manually set a faster or more reliable one.

### Popular Public DNS Servers

| Provider | Preferred DNS | Alternate DNS |
|---|---|---|
| **Google** | `8.8.8.8` | `8.8.4.4` |
| **Cloudflare** | `1.1.1.1` | `1.0.0.1` |
| **OpenDNS** | `208.67.222.222` | `208.67.220.220` |

### How to Change DNS on Windows 11

1. Open **Settings** → **Network & Internet**
2. Click **Wi-Fi** or **Ethernet** → click your active connection
3. Click **Edit** next to DNS server assignment
4. Set to **Manual** and enable **IPv4**
5. Enter your preferred and alternate DNS values
6. Click **Save**
7. Flush your DNS cache in the terminal:
   ```bash
   ipconfig /flushdns
   ```

---

## COMMON DNS COMMANDS

### Flush DNS Cache (Windows)
Clears locally stored DNS lookups, forcing fresh lookups:
```bash
ipconfig /flushdns
```

### Look Up a Domain's IP
```bash
nslookup google.com
```

### Look Up an SRV Record
```bash
nslookup -type=SRV _mongodb._tcp.cluster-one.0kjnxst.mongodb.net
```

### View Your Current DNS Server
```bash
ipconfig /all
```
Look for the **DNS Servers** line under your active network adapter.

---

## DNS AND THIS PROJECT

This project is a full-stack MERN-style quiz application:

| Layer | Port | Start Command |
|---|---|---|
| **React Client** | `3000` | `cd client && npm start` |
| **Express Server** | `3001` | `cd server && npm start` |
| **MongoDB Atlas** | Cloud | SRV connection (see below) |

The server connects to **MongoDB Atlas** using an SRV connection string stored in `server/.env`:

```
DATABASE_URL = mongodb+srv://<user>:<password>@cluster-one.0kjnxst.mongodb.net/?appName=Cluster-One
DATABASE_NAME = quizAppDatabase
```

When the server starts, Mongoose resolves the SRV record:
```
_mongodb._tcp.cluster-one.0kjnxst.mongodb.net
```

This returns the actual hostnames and ports of the Atlas cluster nodes, then connects to the `quizAppDatabase` database.

### Troubleshooting Connection Errors

If you see this error:
```
querySrv ECONNREFUSED _mongodb._tcp.cluster-one.0kjnxst.mongodb.net
```

It means your DNS server cannot resolve the SRV record. Fix it by:
1. Changing your DNS to `8.8.8.8` / `8.8.4.4` (Google)
2. Running `ipconfig /flushdns`
3. Restarting the server with `npm start` (from the `server/` directory)

### Connection Timeouts

The server is configured with:
- **Server selection timeout:** 5000ms
- **Connection timeout:** 10000ms
- Auto-reconnection enabled

If the connection times out, check your network and Atlas cluster status before retrying.