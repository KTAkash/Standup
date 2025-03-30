package com.example.Standup.Config;

import com.example.Standup.JWT.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/su/login", "/su/register", "/su/welcome", "/su/create-admin").permitAll()
                        .requestMatchers("/su/create-teacher", "/su/create-student").hasRole("ADMIN")
                        .requestMatchers("/su/teachers").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/su/students").hasAnyRole("ADMIN", "STUDENT", "TEACHER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public static class JwtFilter extends OncePerRequestFilter {
        private final JwtUtil jwtUtil;

        public JwtFilter(JwtUtil jwtUtil) {
            this.jwtUtil = jwtUtil;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {
            String token = request.getHeader("Authorization");
            System.out.println("Received Authorization header: " + token); // Debug 1

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                System.out.println("Processing JWT Token: " + token); // Debug 2

                try {
                    // Debug 3: Print raw claims
                    Claims claims = jwtUtil.extractAllClaims(token);
                    System.out.println("Decoded JWT Claims: " + claims);
                    System.out.println("Extracted Role: " + claims.get("role", String.class));

                    if (jwtUtil.validateToken(token)) {
                        String username = jwtUtil.extractUsername(token);
                        String role = jwtUtil.extractRole(token);
                        System.out.println("Authentication attempt for: " + username + " with role: " + role); // Debug 4

                        if (username != null && role != null) {
                            UserDetails userDetails = User.withUsername(username)
                                    .password("")
                                    .authorities(role)
                                    .build();

                            UsernamePasswordAuthenticationToken authToken =
                                    new UsernamePasswordAuthenticationToken(
                                            userDetails,
                                            null,
                                            userDetails.getAuthorities());

                            System.out.println("Granted Authorities: " + authToken.getAuthorities()); // Debug 5

                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("JWT Validation Error: " + e.getMessage()); // Debug 6
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            } else {
                System.out.println("No JWT Token found in Authorization header"); // Debug 7
            }
            chain.doFilter(request, response);
        }
    }
}