package pizzaria;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.*;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

public class PizzariaGUI extends JFrame {
    private CardLayout cardLayout;
    private JPanel painelPrincipal;
    private JTextField tfNome, tfMorada, tfTelefone, tfEmail;
    private Carrinho carrinho;
    private Cliente clienteAtual;
    private ButtonGroup grupoEntrega;
    private JRadioButton rbRecolha, rbEntrega;
    private JPanel painelCarrinho;
    private JTextArea taCarrinho, taObservacoes;
    private JLabel lblTotal;
    private JSpinner spinnerHora;

    public PizzariaGUI() {
        setTitle("Pizzaria do Carlos");
        setSize(800, 600);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        getContentPane().setBackground(new Color(235, 255, 235));  // Verde claro pastel

        carrinho = new Carrinho();

        cardLayout = new CardLayout();
        painelPrincipal = new JPanel(cardLayout);
        painelPrincipal.add(criarPainelCliente(), "cliente");
        painelPrincipal.add(criarPainelMenu(), "menu");

        add(painelPrincipal);
        cardLayout.show(painelPrincipal, "cliente");
    }

    private JPanel criarPainelCliente() {
        JPanel painel = new JPanel(new GridBagLayout());
        painel.setBorder(new EmptyBorder(30, 80, 30, 80));
        painel.setBackground(new Color(230, 255, 230)); // Verde muito claro

        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(10, 10, 10, 10);
        c.fill = GridBagConstraints.HORIZONTAL;

        JLabel lblNome = new JLabel("Nome:");
        JLabel lblMorada = new JLabel("Morada:");
        JLabel lblTelefone = new JLabel("Telefone:");
        JLabel lblEmail = new JLabel("Email:");

        tfNome = new JTextField(20);
        tfMorada = new JTextField(20);

        tfTelefone = new JTextField("+351 ");
        tfTelefone.addKeyListener(new KeyAdapter() {
            public void keyTyped(KeyEvent e) {
                String texto = tfTelefone.getText();
                // Permite só dígitos depois do "+351 "
                if (texto.length() >= 14 || !Character.isDigit(e.getKeyChar())) {
                    e.consume();
                }
            }
        });

        tfEmail = new JTextField(20);

        JButton btnAvancar = new JButton("Avançar para o Menu");
        btnAvancar.setBackground(new Color(0, 153, 76)); // Verde escuro
        btnAvancar.setForeground(Color.WHITE);
        btnAvancar.setFont(new Font("Arial", Font.BOLD, 14));
        btnAvancar.addActionListener(e -> guardarCliente());

        c.gridx = 0; c.gridy = 0;
        painel.add(lblNome, c);
        c.gridx = 1; c.gridy = 0;
        painel.add(tfNome, c);

        c.gridx = 0; c.gridy = 1;
        painel.add(lblMorada, c);
        c.gridx = 1; c.gridy = 1;
        painel.add(tfMorada, c);

        c.gridx = 0; c.gridy = 2;
        painel.add(lblTelefone, c);
        c.gridx = 1; c.gridy = 2;
        painel.add(tfTelefone, c);

        c.gridx = 0; c.gridy = 3;
        painel.add(lblEmail, c);
        c.gridx = 1; c.gridy = 3;
        painel.add(tfEmail, c);

        c.gridx = 1; c.gridy = 4;
        c.anchor = GridBagConstraints.EAST;
        painel.add(btnAvancar, c);

        return painel;
    }

    private JPanel criarPainelMenu() {
        JPanel painelMenu = new JPanel(new BorderLayout());
        painelMenu.setBackground(new Color(240, 255, 240)); // Verde claro

        JPanel painelPizzas = new JPanel(new GridLayout(0, 1, 10, 10));
        painelPizzas.setBorder(new EmptyBorder(10, 10, 10, 10));
        painelPizzas.setBackground(new Color(240, 255, 240));

        try {
            List<Pizza> listaPizzas = PizzaDAO.listarPizzas();
            for (Pizza pizza : listaPizzas) {
                JButton btnPizza = new JButton(pizza.getNome() + " - " + pizza.getDescricao());
                btnPizza.setToolTipText("Escolha o tamanho para adicionar ao carrinho");
                btnPizza.setBackground(new Color(180, 230, 180));
                btnPizza.setForeground(Color.BLACK);
                btnPizza.addActionListener(e -> selecionarTamanho(pizza));
                painelPizzas.add(btnPizza);
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Erro ao carregar pizzas: " + ex.getMessage());
        }

        painelCarrinho = new JPanel(new BorderLayout());
        painelCarrinho.setPreferredSize(new Dimension(300, 0));
        painelCarrinho.setBorder(BorderFactory.createTitledBorder("Carrinho"));
        painelCarrinho.setBackground(new Color(230, 255, 230));

        taCarrinho = new JTextArea();
        taCarrinho.setEditable(false);
        JScrollPane scroll = new JScrollPane(taCarrinho);
        painelCarrinho.add(scroll, BorderLayout.CENTER);

        lblTotal = new JLabel("Total: 0.00 € (IVA incl.)");
        painelCarrinho.add(lblTotal, BorderLayout.SOUTH);

        JPanel painelOpcoes = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        painelOpcoes.setBackground(new Color(230, 255, 230));

        grupoEntrega = new ButtonGroup();
        rbRecolha = new JRadioButton("Recolha no restaurante");
        rbEntrega = new JRadioButton("Entrega ao domicílio (+3,90€)");
        grupoEntrega.add(rbRecolha);
        grupoEntrega.add(rbEntrega);
        rbRecolha.setSelected(true);

        painelOpcoes.add(rbRecolha);
        painelOpcoes.add(rbEntrega);

        painelOpcoes.add(new JLabel("Hora da entrega/recolha:"));

        // Spinner da hora compacto e com rato para alterar
        spinnerHora = new JSpinner(new SpinnerDateModel());
        JSpinner.DateEditor editor = new JSpinner.DateEditor(spinnerHora, "HH:mm");
        spinnerHora.setEditor(editor);
        Dimension d = spinnerHora.getPreferredSize();
        d.width = 60;  // menos largura
        spinnerHora.setPreferredSize(d);

        painelOpcoes.add(spinnerHora);

        taObservacoes = new JTextArea(3, 25);
        taObservacoes.setLineWrap(true);
        taObservacoes.setBorder(BorderFactory.createTitledBorder("Observações"));
        painelOpcoes.add(taObservacoes);

        JButton btnFinalizar = new JButton("Finalizar encomenda");
        btnFinalizar.setBackground(new Color(0, 153, 76));
        btnFinalizar.setForeground(Color.WHITE);
        btnFinalizar.addActionListener(e -> confirmarMoradaAntesFinalizar());

        JPanel painelSul = new JPanel(new BorderLayout());
        painelSul.add(painelOpcoes, BorderLayout.CENTER);
        painelSul.add(btnFinalizar, BorderLayout.SOUTH);

        painelMenu.add(new JScrollPane(painelPizzas), BorderLayout.CENTER);
        painelMenu.add(painelCarrinho, BorderLayout.EAST);
        painelMenu.add(painelSul, BorderLayout.SOUTH);

        return painelMenu;
    }

    private void selecionarTamanho(Pizza pizza) {
        String[] opcoes = {"Pequena", "Média", "Grande"};
        int escolha = JOptionPane.showOptionDialog(this, "Escolha o tamanho da pizza:", pizza.getNome(),
                JOptionPane.DEFAULT_OPTION, JOptionPane.INFORMATION_MESSAGE, null, opcoes, opcoes[0]);

        if (escolha >= 0) {
            carrinho.adicionarPizza(pizza, escolha);
            atualizarCarrinho();
        }
    }

    private void atualizarCarrinho() {
        taCarrinho.setText(carrinho.toString());
        lblTotal.setText(String.format("Total: %.2f € (IVA incl.)", carrinho.getTotalComIva().doubleValue()));
    }

    private void guardarCliente() {
        String nome = tfNome.getText().trim();
        String morada = tfMorada.getText().trim();
        String telefone = tfTelefone.getText().trim();
        String email = tfEmail.getText().trim();

        if (nome.isEmpty() || morada.isEmpty() || telefone.isEmpty() || email.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Preencha todos os campos.", "Erro", JOptionPane.ERROR_MESSAGE);
            return;
        }

        clienteAtual = new Cliente(nome, morada, telefone, email);
        try {
            int id = ClienteDAO.inserirCliente(clienteAtual);
            clienteAtual.setId(id);
            cardLayout.show(painelPrincipal, "menu");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erro ao guardar cliente na base de dados: " + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    // Novo método para confirmar morada antes de finalizar
    private void confirmarMoradaAntesFinalizar() {
        String resposta = JOptionPane.showInputDialog(this, "Confirma que a morada está correta?\nMorada atual:\n" + clienteAtual.getMorada() + "\n\nSe não, introduza nova morada:");
        if (resposta == null) return; // Cancelar

        if (!resposta.trim().isEmpty() && !resposta.trim().equals(clienteAtual.getMorada())) {
            clienteAtual.setMorada(resposta.trim());
            // Atualizar base de dados
            try {
                ClienteDAO.atualizarMorada(clienteAtual.getId(), clienteAtual.getMorada());
            } catch (SQLException e) {
                JOptionPane.showMessageDialog(this, "Erro ao atualizar morada: " + e.getMessage(), "Erro", JOptionPane.ERROR_MESSAGE);
            }
        }
        finalizarEncomenda();
    }

    private void finalizarEncomenda() {
        if (carrinho.getItens().isEmpty()) {
            JOptionPane.showMessageDialog(this, "O carrinho está vazio.", "Erro", JOptionPane.ERROR_MESSAGE);
            return;
        }
        String tipoEntrega = rbRecolha.isSelected() ? "Recolha" : "Entrega";
        Date hora = (Date) spinnerHora.getValue();
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");

        String observacoes = taObservacoes.getText().trim();

        try {
            int idEncomenda = EncomendaDAO.inserirEncomenda(clienteAtual, carrinho, tipoEntrega, sdf.format(hora), observacoes);

            // Perguntar se quer descarregar ficheiro txt
            int resposta = JOptionPane.showConfirmDialog(this, "Encomenda registada com sucesso! Quer descarregar o ficheiro da encomenda?", "Sucesso", JOptionPane.YES_NO_OPTION);
            if (resposta == JOptionPane.YES_OPTION) {
                descarregarFicheiroEncomenda(idEncomenda, tipoEntrega, sdf.format(hora), observacoes);
            }

            // Perguntar se quer fazer nova encomenda
            int nova = JOptionPane.showConfirmDialog(this, "Quer fazer uma nova encomenda?", "Nova Encomenda", JOptionPane.YES_NO_OPTION);
            if (nova == JOptionPane.YES_OPTION) {
                carrinho.limpar();
                atualizarCarrinho();
                taObservacoes.setText("");
                cardLayout.show(painelPrincipal, "cliente");
            } else {
                System.exit(0);
            }

        } catch (SQLException | IOException e) {
            JOptionPane.showMessageDialog(this, "Erro ao finalizar encomenda: " + e.getMessage(), "Erro", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void descarregarFicheiroEncomenda(int idEncomenda, String tipoEntrega, String hora, String observacoes) throws IOException {
        String nomeFicheiro = "encomenda_" + idEncomenda + ".txt";
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(nomeFicheiro))) {
            writer.write("Encomenda nº: " + idEncomenda + "\n");
            writer.write("Cliente: " + clienteAtual.getNome() + "\n");
            writer.write("Morada: " + clienteAtual.getMorada() + "\n");
            writer.write("Telefone: " + clienteAtual.getTelefone() + "\n");
            writer.write("Email: " + clienteAtual.getEmail() + "\n");
            writer.write("Tipo: " + tipoEntrega + "\n");
            writer.write("Hora: " + hora + "\n");
            writer.write("Observações: " + observacoes + "\n");
            writer.write("\nItens:\n");
            writer.write(carrinho.toString());
            writer.write(String.format("\nTotal: %.2f € (IVA incluído)\n", carrinho.getTotalComIva().doubleValue()));
        }
        JOptionPane.showMessageDialog(this, "Ficheiro " + nomeFicheiro + " guardado com sucesso!");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new PizzariaGUI().setVisible(true);
        });
    }
}