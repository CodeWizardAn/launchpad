from database import Base, engine
Base.metadata.create_all(bind=engine)
print("All tables created!")