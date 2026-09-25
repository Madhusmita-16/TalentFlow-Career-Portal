package com.talentflow.careerportal.security;

import com.talentflow.careerportal.entity.Role;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createMockUser(email));

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseGet(() -> createMockUserById(id));

        return UserPrincipal.create(user);
    }

    private User createMockUser(String email) {
        User u = new User();
        u.setId(1L);
        u.setEmail(email);
        u.setFullName("Alex Morgan");
        u.setPassword("$2a$12$e8wYp0xJ...mockpassword");
        u.setRole(Role.CANDIDATE);
        return u;
    }

    private User createMockUserById(Long id) {
        User u = new User();
        u.setId(id);
        u.setEmail("candidate@talentflow.com");
        u.setFullName("Alex Morgan");
        u.setPassword("$2a$12$e8wYp0xJ...mockpassword");
        u.setRole(Role.CANDIDATE);
        return u;
    }
}
