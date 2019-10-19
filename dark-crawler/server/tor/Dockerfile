FROM alpine:latest

RUN echo '@edge http://dl-cdn.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories && \
    apk -U upgrade && \
    apk -v add tor@edge curl && \
    chmod 700 /var/lib/tor && \
    rm -rf /var/cache/apk/* && \
    tor --version
    
COPY ./torrc /etc/tor/

HEALTHCHECK --timeout=10s --start-period=60s \
    CMD curl --max-time 2 --fail --socks5-hostname localhost:9150 -I -L 'http://sa6pbdrbllyona5s.onion/' || exit 1

EXPOSE 9150

CMD ["/usr/bin/tor", "-f", "/etc/tor/torrc"]