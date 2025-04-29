using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Sistemaserviciostaller.Data;

public partial class TallervehicularContext : DbContext
{
    public TallervehicularContext()
    {
    }

    public TallervehicularContext(DbContextOptions<TallervehicularContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Cliente { get; set; }

    public virtual DbSet<Detalleservicio> Detalleservicio { get; set; }

    public virtual DbSet<Empleado> Empleado { get; set; }

    public virtual DbSet<Ordenservicio> Ordenservicio { get; set; }

    public virtual DbSet<Servicio> Servicio { get; set; }

    public virtual DbSet<Vehiculo> Vehiculo { get; set; }

  
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cliente");

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.Telefono).HasMaxLength(20);
        });

        modelBuilder.Entity<Detalleservicio>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("detalleservicio");

            entity.HasIndex(e => e.EmpleadoId, "EmpleadoId");

            entity.HasIndex(e => e.OrdenServicioId, "OrdenServicioId");

            entity.HasIndex(e => e.ServicioId, "ServicioId");

            entity.Property(e => e.Comentarios).HasMaxLength(255);

            entity.HasOne(d => d.Empleado).WithMany(p => p.Detalleservicio)
                .HasForeignKey(d => d.EmpleadoId)
                .HasConstraintName("detalleservicio_ibfk_3");

            entity.HasOne(d => d.OrdenServicio).WithMany(p => p.Detalleservicio)
                .HasForeignKey(d => d.OrdenServicioId)
                .HasConstraintName("detalleservicio_ibfk_1");

            entity.HasOne(d => d.Servicio).WithMany(p => p.Detalleservicio)
                .HasForeignKey(d => d.ServicioId)
                .HasConstraintName("detalleservicio_ibfk_2");
        });

        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("empleado");

            entity.Property(e => e.Cargo).HasMaxLength(50);
            entity.Property(e => e.Nombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Ordenservicio>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ordenservicio");

            entity.HasIndex(e => e.VehiculoId, "VehiculoId");

            entity.Property(e => e.Estado).HasMaxLength(50);

            entity.HasOne(d => d.Vehiculo).WithMany(p => p.Ordenservicio)
                .HasForeignKey(d => d.VehiculoId)
                .HasConstraintName("ordenservicio_ibfk_1");
        });

        modelBuilder.Entity<Servicio>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("servicio");

            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.Precio).HasPrecision(10, 2);
        });

        modelBuilder.Entity<Vehiculo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vehiculo");

            entity.HasIndex(e => e.ClienteId, "ClienteId");

            entity.Property(e => e.Marca).HasMaxLength(50);
            entity.Property(e => e.Modelo).HasMaxLength(50);
            entity.Property(e => e.Placa).HasMaxLength(20);

            entity.HasOne(d => d.Cliente).WithMany(p => p.Vehiculo)
                .HasForeignKey(d => d.ClienteId)
                .HasConstraintName("vehiculo_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
