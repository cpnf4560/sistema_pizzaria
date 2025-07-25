package pizzaria;

public class Cliente {
    private int id;
    private String nome;
    private String morada;
    private String telefone;
    private String email;

    public Cliente() {}

    public Cliente(String nome, String morada, String telefone, String email) {
        this.nome = nome;
        this.morada = morada;
        this.telefone = telefone;
        this.email = email;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getMorada() { return morada; }
    public void setMorada(String morada) { this.morada = morada; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}