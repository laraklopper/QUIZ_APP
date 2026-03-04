# DNS Connections
**OVERVIEW**
DNS `(Domain Name System)` is like a phone book for the internet. It translates human-readable domain names (e.g. `google.com`) into IP addresses (e.g. `142.250.80.46`) that computers use to communicate with each other.
Without DNS, you would need to memorize IP addresses for every website or service you want to connect to.
## TABLE OF CONTENTS
1. [HOW DNS WORKS](#how-dns-works)




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

