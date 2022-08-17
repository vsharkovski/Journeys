package com.sorsix.journeys.security.jwt

import com.sorsix.journeys.security.service.UserDetailsImpl
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.UnsupportedJwtException
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.security.SignatureException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Component
import org.springframework.web.util.WebUtils
import java.util.*
import javax.annotation.PostConstruct
import javax.crypto.SecretKey
import javax.servlet.http.HttpServletRequest

@Component
class JwtUtils(
    @Value("\${journeys.app.jwtSecret}")
    val jwtSecret: String,
    @Value("\${journeys.app.jwtExpirationMs}")
    val jwtExpirationMs: Int,
    @Value("\${journeys.app.jwtCookieName}")
    val jwtCookie: String
) {
    var key: SecretKey = Keys.hmacShaKeyFor(ByteArray(512))
    val logger: Logger = LoggerFactory.getLogger(JwtUtils::class.java)

    @PostConstruct
    private fun postConstruct() {
        val bytes = jwtSecret.toByteArray()
        key = Keys.hmacShaKeyFor(
            if (bytes.size >= 64) bytes
            else bytes.plus(ByteArray(64 - bytes.size))
        )
    }

    fun getJwtFromCookies(request: HttpServletRequest): String? =
        WebUtils.getCookie(request, jwtCookie)?.value

    fun generateJwtCookie(userPrincipal: UserDetailsImpl): ResponseCookie {
        val jwt = generateTokenFromUsername(userPrincipal.username)
        return ResponseCookie.from(jwtCookie, jwt)
            .path("/api").maxAge(jwtExpirationMs.toLong()).httpOnly(true).build()
    }

    fun getCleanJwtCookie(): ResponseCookie =
        ResponseCookie.from(jwtCookie, "").path("/api").build()

    fun getUserNameFromJwtToken(token: String): String =
        Jwts.parserBuilder().setSigningKey(key).build()
            .parseClaimsJws(token).body.subject

    fun validateJwtToken(authToken: String): Boolean = try {
        Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken)
        true
    } catch (e: Exception) {
        when (e) {
            is SignatureException -> logger.error("Invalid JWT signature [{}]", e.message)
            is MalformedJwtException -> logger.error("Invalid JWT token [{}]", e.message)
            is ExpiredJwtException -> logger.error("JWT token is expired [{}]", e.message)
            is UnsupportedJwtException -> logger.error("JWT token is unsupported [{}]", e.message)
            is IllegalArgumentException -> logger.error("JWT claims string is empty [{}]", e.message)
        }
        false
    }

    fun generateTokenFromUsername(username: String): String =
        Jwts.builder()
            .setSubject(username)
            .setIssuedAt(Date())
            .setExpiration(Date(Date().time + jwtExpirationMs))
            .signWith(key, SignatureAlgorithm.HS512)
            .compact()
}