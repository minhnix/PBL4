package com.chat.server.service.call;

import com.chat.server.exception.BadRequestException;
import com.chat.server.model.CallUserInfo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class CallStorage {
    private final Map<String, List<CallUserInfo>> storages = new ConcurrentHashMap<>();

    public Map<String, List<CallUserInfo>> getStorages() {
        return storages;
    }

    public List<CallUserInfo> userJoin(String key, String userId, String username) {
        List<CallUserInfo> userList = storages.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>());
        if (isExistsCallUserInfo(key, userId)) throw new RuntimeException(""); //TODO: HANDLE IF USER IS CALLING
        userList.add(new CallUserInfo(userId, username, true, true));
        return userList;
    }

    public void userLeave(String key, String userId) {
        List<CallUserInfo> userList = storages.get(key);
        if (userList == null) return;
        userList.removeIf(callUserInfo -> callUserInfo.getUserId().equals(userId));
    }

    public List<CallUserInfo> getValue(String key) {
        return storages.get(key);
    }

    public CallUserInfo getInfo(String key, String userId) {
        List<CallUserInfo> userList = storages.get(key);
        if (userList == null) return null;
        Optional<CallUserInfo> call = userList.stream()
                .filter(callUserInfo -> callUserInfo.getUserId().equals(userId))
                .findFirst();
        return call.orElse(null);
    }

    public boolean isExistsCallUserInfo(String key, String userId) {
        List<CallUserInfo> userList = storages.get(key);
        if (userList == null) return false;
        return userList.stream().anyMatch(callUserInfo -> callUserInfo.getUserId().equals(userId));
    }

}
