package pizzaria;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ClienteDAO {

    public static int inserirCliente(Cliente cliente) throws SQLException {
        String sql = "INSERT INTO clientes (nome, morada, telefone, email) VALUES (?, ?, ?, ?)";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, cliente.getNome());
            stmt.setString(2, cliente.getMorada());
            stmt.setString(3, cliente.getTelefone());
            stmt.setString(4, cliente.getEmail());

            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    int id = rs.getInt(1);
                    cliente.setId(id);
                    return id;
                }
            }
        }
        return -1;
    }

    public static void atualizarMorada(int id, String novaMorada) throws SQLException {
        String sql = "UPDATE clientes SET morada = ? WHERE id = ?";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, novaMorada);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        }
    }

    public static Cliente buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM clientes WHERE id = ?";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Cliente c = new Cliente();
                    c.setId(rs.getInt("id"));
                    c.setNome(rs.getString("nome"));
                    c.setMorada(rs.getString("morada"));
                    c.setTelefone(rs.getString("telefone"));
                    c.setEmail(rs.getString("email"));
                    return c;
                }
            }
        }
        return null;
    }

    public static List<Cliente> listarTodos() throws SQLException {
        List<Cliente> lista = new ArrayList<>();
        String sql = "SELECT * FROM clientes";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Cliente c = new Cliente();
                c.setId(rs.getInt("id"));
                c.setNome(rs.getString("nome"));
                c.setMorada(rs.getString("morada"));
                c.setTelefone(rs.getString("telefone"));
                c.setEmail(rs.getString("email"));
                lista.add(c);
            }
        }
        return lista;
    }
}