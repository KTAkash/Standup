package com.example.StandUp.Configuration;

import com.example.StandUp.JWT.Jwt;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final Jwt jwt;

    public SecurityConfig(Jwt jwt) {
        this.jwt = jwt;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/su/login", "/su/register", "/su/welcome", "/su/create-admin").permitAll()

                        // Admin-only: Create, update, delete users
                        .requestMatchers(
                                "/su/create-teacher",
                                "/su/create-student",
                                "/su/update-teacher/**",
                                "/su/delete-teacher/**",
                                "/su/update-student/**",
                                "/su/delete-student/**"
                        ).hasRole("ADMIN")

                        // Admin, Teacher, Student can view teachers/students
                        .requestMatchers("/su/teachers").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/su/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/su/teacher/dashboard").hasAnyRole("ADMIN", "TEACHER")

                        .requestMatchers("/su/students").hasAnyRole("ADMIN", "TEACHER", "STUDENT")

                        // Module access
                        .requestMatchers(HttpMethod.GET, "/su/modules/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                        .requestMatchers("/su/modules/**").hasRole("ADMIN")

                        // Topic access
                        .requestMatchers(HttpMethod.GET, "/su/topics/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                        .requestMatchers("/su/topics/**").hasRole("ADMIN")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(jwt), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public static class JwtFilter extends OncePerRequestFilter {
        private final Jwt jwt;

        public JwtFilter(Jwt jwt) {
            this.jwt = jwt;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {
            String token = request.getHeader("Authorization");
            System.out.println("Received Authorization header: " + token);

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                try {
                    Claims claims = jwt.extractAllClaims(token);
                    if (jwt.validateToken(token)) {
                        String username = jwt.extractUsername(token);
                        String role = jwt.extractRole(token);

                        UserDetails userDetails = User.withUsername(username)
                                .password("")
                                .authorities(role)
                                .build();

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities());

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } catch (Exception e) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            }
            chain.doFilter(request, response);
        }
    }
}
