package com.bankingapp.Server.dto;

public class UpdateUserRequest {
    private String fullname;
    private String email;
    private String username;

    public UpdateUserRequest() {
    }

    public UpdateUserRequest(String fullname, String email, String username) {
        this.fullname = fullname;
        this.email = email;
        this.username = username;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public static UpdateUserRequestBuilder builder() {
        return new UpdateUserRequestBuilder();
    }

    public static class UpdateUserRequestBuilder {
        private String fullname;
        private String email;
        private String username;

        UpdateUserRequestBuilder() {
        }

        public UpdateUserRequestBuilder fullname(String fullname) {
            this.fullname = fullname;
            return this;
        }

        public UpdateUserRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UpdateUserRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UpdateUserRequest build() {
            return new UpdateUserRequest(fullname, email, username);
        }

        public String toString() {
            return "UpdateUserRequest.UpdateUserRequestBuilder(fullname=" + this.fullname + ", email=" + this.email + ", username=" + this.username + ")";
        }
    }
}
