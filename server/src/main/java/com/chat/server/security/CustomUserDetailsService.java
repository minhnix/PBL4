package com.chat.server.security;


import com.chat.server.model.User;
import com.chat.server.repository.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepo.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email : " + usernameOrEmail));
        return CustomUserDetails.create(user);
    }
    @Transactional
    public UserDetails loadUserById(String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        return CustomUserDetails.create(user);
    }
}
