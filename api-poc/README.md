### Local Certificate creation

## MkCert Download

sudo apt install libnss3-tools
curl -Lo /tmp/mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-linux-amd64
chmod +x /tmp/mkcert
sudo mv /tmp/mkcert /usr/local/bin/mkcert

## MkCert Install

mkcert -install

## Certificate creation //WildCard is Optional

mkcert -cert-file {DIR}/{name}cert.pem -key-file {DIR}/{NAME}key.pem {HOST} {WILDCARD}
