package com.chat.server.service;


import com.chat.server.exception.BadRequestException;
import com.chat.server.exception.ResourceNotFoundException;
import com.chat.server.model.User;
import com.chat.server.payload.request.SignUpRequest;
import com.chat.server.payload.response.PagedResponse;
import com.chat.server.repository.UserRepo;
import com.chat.server.util.ValidatePageable;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
// log.in anotition
@Slf4j
public class UserService {
    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    Logger logger = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(SignUpRequest signUpRequest) {


        if (userRepo.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email already in use!!!");
        }

        if (userRepo.existsByUsername(signUpRequest.getUsername())) {
            throw new BadRequestException("Username already in use!!!");
        }

        if (userRepo.existsByPhoneNumber(signUpRequest.getPhoneNumber())) {
            throw new BadRequestException("Phone Number already in use!!!");
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(), signUpRequest.getPassword(), signUpRequest.getPhoneNumber());

        user.setId(userRepo.count() + 1);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (signUpRequest.getFirstname() != null && signUpRequest.getLastname() != null) {
            user.setFirstname(signUpRequest.getFirstname());
            user.setLastname(signUpRequest.getLastname());
        }


        logger.info("Created user: " + signUpRequest.toString());
        return userRepo.save(user);
    }


    public User getOneUser(String username) {
        return (User) userRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    public PagedResponse<User> getAll(int page, int size, String sortBy, String sortDir, String keyword) {
        ValidatePageable.invoke(page, size);

        Sort sort = (sortDir.equalsIgnoreCase("des")) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> users;
        if (keyword == null)
            users = userRepo.findAll(pageable);
        else
            users = userRepo.findByUsernameContainingOrEmailContainingOrPhoneNumberContaining(keyword, keyword, keyword, pageable);
        return new PagedResponse<>(users.getContent(), users.getNumber(),
                users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
    }

    public void deleteUser(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepo.delete(user);
    }

//    public PagedResponse<User> getAll(int page, int size, String sortBy, String sortDir, String keyword) {
//    }


//    @Transactional(rollbackFor = {ResourceNotFoundException.class})
//    @CacheEvict(value = "usersById")
//    public void deleteByUserId(Long id) {
//        User user = userRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
//        userRepo.delete(user);
//    }

//    @CachePut(value = "usersById")
//    public User updateUser(Long id, UpdateUserRequest updateRequest) {
//        User user = userRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Id", "userId", id));
//        if (updateRequest.getFirstname() != null) {
//            user.setFirstname(updateRequest.getFirstname());
//        }
//        if (updateRequest.getLastname() != null) {
//            user.setLastname(updateRequest.getLastname());
//        }
//        if (updateRequest.getPhoneNumber() != null) {
//            user.setPhoneNumber(updateRequest.getPhoneNumber());
//        }
//        if (updateRequest.getEmail() != null) {
//            user.setEmail(updateRequest.getEmail());
//        }
//        Address address = user.getAddress();
//        if (address == null) address = new Address();
//        if (updateRequest.getAddress() != null) {
//            Address address1 = updateRequest.getAddress();
//            if (address1.getCity() != null) {
//                address.setCity(address1.getCity());
//            }
//            if (address1.getWard() != null) {
//                address.setWard(address1.getWard());
//            }
//            if (address1.getRoad() != null) {
//                address.setRoad(address1.getRoad());
//            }
//            if (address1.getDistrict() != null) {
//                address.setDistrict(address1.getDistrict());
//            }
//            if (address1.getDistrictCode() != null) {
//                address.setDistrictCode(address1.getDistrictCode());
//            }
//            if (address1.getWardCode() != null) {
//                address.setWardCode(address1.getWardCode());
//            }
//            user.setAddress(address);
//        }
//        return userRepo.save(user);
//    }
//
//    public PagedResponse<User> getAll(int page, int size, String sortBy, String sortDir, Long roleId, String keyword) {
//        ValidatePageable.invoke(page, size);
//
//        Sort sort = (sortDir.equalsIgnoreCase("des")) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
//        Pageable pageable = PageRequest.of(page, size, sort);
//        Page<User> users;
//        if (roleId == null)
//            users = userRepo.findAll(pageable);
//        else
//            users = userRepo.findUserByRolesId(roleId, pageable);
//        return new PagedResponse<>(users.getContent(), users.getNumber(),
//                users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
//    }
//
//    public User getOneUser(String username) {
//        return userRepo.findByUsername(username)
//                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
//    }
//
//    public User getProfile(UserPrincipal userPrincipal) {
//        return userPrincipal.getUser();
//    }
//
//    @CacheEvict(value = "usersById", allEntries = true)
//    public void updatePassword(UserPrincipal userPrincipal, UpdatePasswordRequest updatePasswordRequest) throws InvalidPasswordException {
//        if (passwordEncoder.matches(updatePasswordRequest.getOldPassword(), userPrincipal.getUser().getPassword())) {
//            User user = userPrincipal.getUser();
//            user.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
//            userRepo.save(user);
//        } else if (updatePasswordRequest.getOldPassword().equals(updatePasswordRequest.getNewPassword())) {
//            throw new BadRequestException("New password does not match old password");
//        } else {
//            throw new InvalidPasswordException(false, "Wrong old password");
//        }
//    }
//    @Transactional(rollbackFor = {MessagingException.class, UnsupportedEncodingException.class})
//    @CacheEvict(value = "usersById", allEntries = true)
//    public void sendResetPasswordEmail(String email) throws MessagingException, UnsupportedEncodingException {
//        User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
//        String toAddress = user.getEmail();
//        String senderName = "DUT Milk Tea";
//        String subject = "Reset password";
//        String content = "Dear [[name]],<br>"
//                + "New password: [[password]]<br>"
//                + "DUT Milk Tea.";
//        String password = RandomStringUtils.randomAlphanumeric(10);
//        content = content.replace("[[name]]", user.getUsername());
//        content = content.replace("[[password]]", password);
//
//        emailSender.sendTo(toAddress, senderName, subject, content);
//        user.setPassword(passwordEncoder.encode(password));
//        userRepo.save(user);
//    }
//
//    @Transactional
//    public void deleteUser(Long userId) {
//        User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
//
//    }


}
